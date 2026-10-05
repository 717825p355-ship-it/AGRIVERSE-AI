import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:flutter_tts/flutter_tts.dart';

class VoiceUtils {
  static final stt.SpeechToText _speech = stt.SpeechToText();
  static final FlutterTts _tts = FlutterTts();

  static Future<bool> initializeSpeech() async {
    return await _speech.initialize();
  }

  static void startListening(Function(String) onResult) {
    _speech.listen(
      onResult: (val) {
        if (val.recognizedWords.isNotEmpty) {
          onResult(val.recognizedWords);
        }
      },
    );
  }

  static void stopListening() {
    _speech.stop();
  }

  static Future<void> speak(String text) async {
    await _tts.setLanguage("en-IN"); // Warm regional accents
    await _tts.setSpeechRate(0.45);  // Slow, easily understood pace
    await _tts.setPitch(1.0);
    await _tts.speak(text);
  }

  static Future<void> stopSpeaking() async {
    await _tts.stop();
  }
}
