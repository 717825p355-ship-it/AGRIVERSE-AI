import '../models/message.dart';
import '../models/conversation.dart';
import '../repository/chat_repository.dart';
import 'gemini_service.dart';

class ChatService {
  final ChatRepository _repository = ChatRepository();
  GeminiService? _gemini;

  void initialize(String apiKey) {
    _gemini = GeminiService(apiKey: apiKey);
  }

  bool get isInitialized => _gemini != null;

  Future<List<ConversationModel>> getHistory() => _repository.loadConversations();
  
  Future<List<MessageModel>> getMessages(String conversationId) => 
      _repository.loadMessages(conversationId);

  Future<void> saveMessages(String convoId, List<MessageModel> list) =>
      _repository.saveMessages(convoId, list);

  Future<void> saveConversations(List<ConversationModel> list) =>
      _repository.saveConversations(list);

  Stream<String> getAIStream({
    required String prompt,
    List<MessageModel> history = const [],
    List<ChatAttachment> attachments = const [],
  }) {
    if (_gemini == null) {
      return Stream.value("AgriGPT Gemini client is not initialized. Please configure your API key in Settings.");
    }
    return _gemini!.streamChatResponse(
      prompt: prompt,
      history: history,
      attachments: attachments,
    );
  }

  Future<void> deleteConvo(String id) => _repository.deleteConversation(id);
}
