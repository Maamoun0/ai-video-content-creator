import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_STUDIO_API_KEY || "");

// Generate an image for a scene using Imagen
async function generateSceneImage(description: string, index: number, outputDir: string): Promise<string> {
  const outputPath = path.join(outputDir, `scene_${index}.png`);
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${process.env.GOOGLE_AI_STUDIO_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt: description }],
          parameters: { sampleCount: 1, aspectRatio: "16:9" }
        })
      }
    );

    const data = await response.json();
    
    if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
      const imageBuffer = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`  ✅ Scene ${index + 1} image generated`);
      return outputPath;
    } else {
      console.error(`  ⚠️ Scene ${index + 1}: Imagen returned no image, using fallback`);
      // Create a simple colored placeholder
      return createFallbackImage(outputPath, description, index);
    }
  } catch (err: any) {
    console.error(`  ⚠️ Scene ${index + 1} image generation failed: ${err.message}`);
    return createFallbackImage(outputPath, description, index);
  }
}

// Create a simple fallback image using FFmpeg
function createFallbackImage(outputPath: string, text: string, index: number): string {
  const colors = ['#1a0533', '#0a1628', '#1c0a00', '#001a1a'];
  const color = colors[index % colors.length];
  try {
    execSync(
      `ffmpeg -y -f lavfi -i color=c=${color.replace('#','')}:s=1920x1080:d=1 -vframes 1 "${outputPath}"`,
      { stdio: 'pipe' }
    );
  } catch {
    // If FFmpeg fails, create a minimal PNG programmatically
    const pngHeader = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A
    ]);
    fs.writeFileSync(outputPath, pngHeader);
  }
  return outputPath;
}

export async function renderVideo(project: any): Promise<{ url: string; filename: string; localPath: string }> {
  console.log(`\n🎬 Starting REAL render for: "${project.title}"`);
  
  // Create output directory
  const outputDir = path.join(process.cwd(), 'renders', project.id);
  fs.mkdirSync(outputDir, { recursive: true });

  const scenes = project.script?.scenes || [];
  const aspectRatio = project.aspectRatio || '16:9';
  const width = aspectRatio === '9:16' ? 1080 : 1920;
  const height = aspectRatio === '9:16' ? 1920 : 1080;
  const duration = project.durationSeconds || 60;
  const sceneDuration = Math.max(3, Math.floor(duration / Math.max(scenes.length, 1)));

  // Step 1: Generate images for each scene
  console.log(`\n📸 Generating ${scenes.length} scene images...`);
  const imagePaths: string[] = [];
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const prompt = `Cinematic, professional photography, ${scene.visual_description}. High quality, 4K, dramatic lighting.`;
    const imgPath = await generateSceneImage(prompt, i, outputDir);
    imagePaths.push(imgPath);
  }

  // Step 2: Check if FFmpeg is available
  let ffmpegAvailable = false;
  try {
    execSync('ffmpeg -version', { stdio: 'pipe' });
    ffmpegAvailable = true;
  } catch {
    ffmpegAvailable = false;
  }

  const outputFilename = `${(project.title || 'video').replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}_1080p.mp4`;
  const outputPath = path.join(outputDir, outputFilename);

  if (ffmpegAvailable && imagePaths.length > 0) {
    // Step 3: Create video from images using FFmpeg
    console.log(`\n🎞️ Stitching ${imagePaths.length} scenes into video (${width}x${height})...`);

    // Create ffmpeg concat file
    const concatFile = path.join(outputDir, 'concat.txt');
    const concatContent = imagePaths
      .map(p => `file '${p.replace(/\\/g, '/')}'\nduration ${sceneDuration}`)
      .join('\n');
    fs.writeFileSync(concatFile, concatContent + `\nfile '${imagePaths[imagePaths.length - 1].replace(/\\/g, '/')}'`);

    try {
      const cmd = `ffmpeg -y -f concat -safe 0 -i "${concatFile}" -vf "scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=black" -c:v libx264 -pix_fmt yuv420p -r 30 "${outputPath}"`;
      console.log(`Running: ${cmd}`);
      execSync(cmd, { stdio: 'pipe', timeout: 120000 });
      console.log(`\n✅ Video rendered successfully: ${outputPath}`);
    } catch (err: any) {
      console.error(`FFmpeg stitch failed: ${err.stderr?.toString() || err.message}`);
      return { url: '', filename: outputFilename, localPath: '' };
    }
  } else {
    console.log(`\n⚠️ FFmpeg not available - returning scene images as preview`);
  }

  // Return the result
  const fileExists = fs.existsSync(outputPath);
  return {
    url: fileExists ? `/renders/${project.id}/${outputFilename}` : '',
    filename: outputFilename,
    localPath: fileExists ? outputPath : outputDir
  };
}
