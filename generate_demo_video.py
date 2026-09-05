import os
import subprocess
import shutil

ASSETS_DIR = "/Users/bassemabifarah/Documents/cine-analytics-ai/assets"
TEMP_DIR = os.path.join(ASSETS_DIR, "temp_video_build")
OUTPUT_VIDEO = os.path.join(ASSETS_DIR, "cine_analytics_demo_video.mp4")

SCENES = [
    {
        "id": "scene1",
        "image": os.path.join(ASSETS_DIR, "video_title_slide.jpg"),
        "fallback_image": "/Users/bassemabifarah/.gemini/antigravity/brain/21fcef1d-7c46-4c2a-b671-23b0e710cf41/video_title_slide_1788589644925.jpg",
        "script": "Welcome to CineAnalytics AI, built for Google Cloud's Agentic Cinema Blockbuster Hackathon on the ClickHouse Partner Track. In modern entertainment, film studios and streaming networks struggle to connect theatrical box office sales, streaming quality of experience, and viral social sentiment. CineAnalytics AI transforms this chaos into an autonomous, real-time command center."
    },
    {
        "id": "scene2",
        "image": os.path.join(ASSETS_DIR, "cine_dashboard_hero.jpg"),
        "fallback_image": os.path.join(ASSETS_DIR, "cine_dashboard_hero_1788588892507.jpg"),
        "script": "Here is the Executive Studio Command Center. At a glance, studio directors can monitor real-time global box office gross, projected at 145.5 million dollars, track streaming quality of experience health scores, observe audience sentiment across TikTok and YouTube, and interact directly with the Gemini 2.5 Flash Studio Director."
    },
    {
        "id": "scene3",
        "image": os.path.join(ASSETS_DIR, "gemini_agent_console.jpg"),
        "fallback_image": os.path.join(ASSETS_DIR, "gemini_agent_console_1788588930290.jpg"),
        "script": "Behind the scenes, a Google Agent Development Kit multi-agent fleet coordinates in real time. The Box Office Analyst, Streaming QoS Agent, Sentiment Analyst, and Marketing Orchestrator inspect live telemetry using ClickHouse tools, detecting friction and autonomously logging executive decisions with zero manual latency."
    },
    {
        "id": "scene4",
        "image": os.path.join(ASSETS_DIR, "clickhouse_analytics_view.jpg"),
        "fallback_image": os.path.join(ASSETS_DIR, "clickhouse_analytics_view_1788588987825.jpg"),
        "script": "ClickHouse powers real-time analytics with Medallion architecture marts. Notice how the scene-by-scene retention heatmap flags a critical buffering anomaly during Scene 3. The agent immediately detects this drop, alerts the director, and engineers can run custom read-only SQL queries directly in the ClickHouse sandbox."
    },
    {
        "id": "scene5",
        "image": os.path.join(ASSETS_DIR, "video_outro_slide.jpg"),
        "fallback_image": "/Users/bassemabifarah/.gemini/antigravity/brain/21fcef1d-7c46-4c2a-b671-23b0e710cf41/video_outro_slide_1788589737483.jpg",
        "script": "CineAnalytics AI passed all five evaluation and safety tests and is fully open source under the Apache 2.0 license on GitHub. Experience the future of autonomous media orchestration with Gemini 2.5 Flash and ClickHouse. Thank you for watching!"
    }
]

def build_video():
    os.makedirs(TEMP_DIR, exist_ok=True)
    segment_videos = []

    print("🎬 Generating Voiceovers and Video Segments for CineAnalytics AI...")

    for i, sc in enumerate(SCENES):
        print(f"\nProcessing Scene {i+1}/{len(SCENES)}: {sc['id']}...")
        
        # 1. Resolve image
        img_path = sc["image"]
        if not os.path.exists(img_path) and os.path.exists(sc.get("fallback_image", "")):
            shutil.copyfile(sc["fallback_image"], img_path)
        
        # 2. Synthesize audio with 'say'
        aiff_path = os.path.join(TEMP_DIR, f"{sc['id']}.aiff")
        aac_path = os.path.join(TEMP_DIR, f"{sc['id']}.m4a")
        
        # Try Daniel or default voice
        cmd_tts = f'say -v Daniel "{sc["script"]}" -o "{aiff_path}" || say "{sc["script"]}" -o "{aiff_path}"'
        subprocess.run(cmd_tts, shell=True, check=True)
        
        # Convert aiff to m4a/aac
        cmd_convert = f'afconvert -f mp4f -d aac "{aiff_path}" "{aac_path}"'
        subprocess.run(cmd_convert, shell=True, check=True)

        # 3. Get audio duration using ffprobe
        cmd_probe = f'ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "{aac_path}"'
        duration_str = subprocess.check_output(cmd_probe, shell=True).decode().strip()
        duration = float(duration_str) + 1.2 # Add 1.2s padding
        print(f"Scene {i+1} Audio Duration: {duration:.2f} seconds")

        # 4. Create segment video with ffmpeg (scaling image with smooth pad to 1920x1080)
        seg_video = os.path.join(TEMP_DIR, f"{sc['id']}_video.mp4")
        cmd_ffmpeg_seg = (
            f'ffmpeg -y -loop 1 -i "{img_path}" -i "{aac_path}" '
            f'-filter_complex "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p[v]" '
            f'-map "[v]" -map 1:a -c:v libx264 -c:a aac -t {duration} -shortest "{seg_video}"'
        )
        subprocess.run(cmd_ffmpeg_seg, shell=True, check=True)
        segment_videos.append(seg_video)

    # 5. Concatenate segments
    concat_list_file = os.path.join(TEMP_DIR, "concat_list.txt")
    with open(concat_list_file, "w") as f:
        for seg in segment_videos:
            f.write(f"file '{seg}'\n")

    print(f"\nCombining all {len(segment_videos)} scenes into final blockbuster demo video...")
    cmd_concat = (
        f'ffmpeg -y -f concat -safe 0 -i "{concat_list_file}" '
        f'-c copy "{OUTPUT_VIDEO}"'
    )
    subprocess.run(cmd_concat, shell=True, check=True)

    # Clean up temp files
    shutil.rmtree(TEMP_DIR, ignore_errors=True)
    
    file_size_mb = os.path.getsize(OUTPUT_VIDEO) / (1024 * 1024)
    print(f"\n🎉 Successfully created Demo Video!")
    print(f"📁 Path: {OUTPUT_VIDEO}")
    print(f"📊 Size: {file_size_mb:.2f} MB")

if __name__ == "__main__":
    build_video()
