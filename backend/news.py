import argparse
from gtts import gTTS

parser = argparse.ArgumentParser()
parser.add_argument('--text', required=True)
parser.add_argument('--language', required=True)
parser.add_argument('--output_path', required=True)
args = parser.parse_args()

tts = gTTS(text=args.text, lang=args.language)
tts.save(args.output_path)
