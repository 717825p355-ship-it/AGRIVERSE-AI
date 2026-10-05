import 'package:google_generative_ai/google_generative_ai.dart';
import '../models/message.dart';

class GeminiService {
  final String apiKey;
  late final GenerativeModel _model;

  GeminiService({required this.apiKey}) {
    _model = GenerativeModel(
      model: 'gemini-1.5-flash',
      apiKey: apiKey,
      systemInstruction: Content.system(
        "You are AgriGPT, an advanced AI Agriculture Assistant. "
        "Help farmers increase crop yield, reduce costs, improve soil health, and practice sustainable farming. "
        "Explain scientific ideas in very simple, structured, and easy-to-understand language. "
        "Focus on practical agronomy, organic options, pests, weather-based advice, and government scheme eligibility. "
        "Keep responses highly structured with beautiful emojis, bulleted steps, and precautions."
      ),
    );
  }

  Stream<String> streamChatResponse({
    required String prompt,
    List<MessageModel> history = const [],
    List<ChatAttachment> attachments = const [],
  }) async* {
    try {
      final List<Content> contents = [];

      // Include recent conversational logs (up to 10 context nodes)
      for (var msg in history.take(10)) {
        if (msg.role == MessageRole.user) {
          contents.add(Content.text(msg.text));
        } else {
          contents.add(Content.model([TextPart(msg.text)]));
        }
      }

      final List<Part> parts = [TextPart(prompt)];

      // Model attachment prompts
      for (var att in attachments) {
        if (att.type == 'image') {
          parts.add(TextPart("[Analyzed Image Attachment: ${att.name}]"));
        } else if (att.type == 'pdf') {
          parts.add(TextPart("[Analyzed PDF Document: ${att.name}]"));
        }
      }

      contents.add(Content('user', parts));

      final responseStream = _model.generateContentStream(contents);
      
      await for (final chunk in responseStream) {
        if (chunk.text != null) {
          yield chunk.text!;
        }
      }
    } catch (e) {
      yield "Error connecting to AgriGPT: ${e.toString()}. Please check your internet connection and retry.";
    }
  }
}
