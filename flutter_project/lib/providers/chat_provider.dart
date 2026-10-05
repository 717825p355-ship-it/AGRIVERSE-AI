import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../models/message.dart';
import '../models/conversation.dart';
import '../services/chat_service.dart';

class ChatState {
  final List<ConversationModel> conversations;
  final String? activeConversationId;
  final List<MessageModel> activeMessages;
  final List<ChatAttachment> pendingAttachments;
  final bool isThinking;
  final String searchQuery;

  ChatState({
    this.conversations = const [],
    this.activeConversationId,
    this.activeMessages = const [],
    this.pendingAttachments = const [],
    this.isThinking = false,
    this.searchQuery = '',
  });

  ChatState copyWith({
    List<ConversationModel>? conversations,
    String? activeConversationId,
    List<MessageModel>? activeMessages,
    List<ChatAttachment>? pendingAttachments,
    bool? isThinking,
    String? searchQuery,
  }) {
    return ChatState(
      conversations: conversations ?? this.conversations,
      activeConversationId: activeConversationId ?? this.activeConversationId,
      activeMessages: activeMessages ?? this.activeMessages,
      pendingAttachments: pendingAttachments ?? this.pendingAttachments,
      isThinking: isThinking ?? this.isThinking,
      searchQuery: searchQuery ?? this.searchQuery,
    );
  }
}

class ChatNotifier extends StateNotifier<ChatState> {
  final ChatService _service = ChatService();
  final _uuid = const Uuid();

  ChatNotifier() : super(ChatState()) {
    _service.initialize("AIzaSyAgriGPTDummyKey");
    _loadAllConversations();
  }

  Future<void> _loadAllConversations() async {
    final list = await _service.getHistory();
    state = state.copyWith(conversations: list);
  }

  List<ConversationModel> get filteredConversations {
    if (state.searchQuery.isEmpty) return state.conversations;
    return state.conversations
        .where((c) => c.title.toLowerCase().contains(state.searchQuery.toLowerCase()))
        .toList();
  }

  void updateSearch(String query) {
    state = state.copyWith(searchQuery: query);
  }

  Future<void> selectConversation(String id) async {
    final msgs = await _service.getMessages(id);
    state = state.copyWith(
      activeConversationId: id,
      activeMessages: msgs,
      pendingAttachments: [],
    );
  }

  Future<void> startNewChat() async {
    state = state.copyWith(
      activeConversationId: null,
      activeMessages: [],
      pendingAttachments: [],
    );
  }

  void addAttachment(String name, String path, String type) {
    final newAttachment = ChatAttachment(
      id: _uuid.v4(),
      name: name,
      path: path,
      type: type,
    );
    state = state.copyWith(
      pendingAttachments: [...state.pendingAttachments, newAttachment],
    );
  }

  void removePendingAttachment(String id) {
    state = state.copyWith(
      pendingAttachments: state.pendingAttachments.where((a) => a.id != id).toList(),
    );
  }

  Future<void> sendMessage(String text) async {
    if (text.trim().isEmpty && state.pendingAttachments.isEmpty) return;

    final convoId = state.activeConversationId ?? _uuid.v4();
    final isNewConvo = state.activeConversationId == null;

    final userMsg = MessageModel(
      id: _uuid.v4(),
      role: MessageRole.user,
      text: text,
      timestamp: DateTime.now(),
      attachments: state.pendingAttachments,
    );

    final updatedMessages = [...state.activeMessages, userMsg];
    
    state = state.copyWith(
      activeConversationId: convoId,
      activeMessages: updatedMessages,
      pendingAttachments: [],
      isThinking: true,
    );

    final aiMsgId = _uuid.v4();
    final aiPlaceholder = MessageModel(
      id: aiMsgId,
      role: MessageRole.ai,
      text: "",
      timestamp: DateTime.now(),
      isLoading: true,
    );

    state = state.copyWith(
      activeMessages: [...state.activeMessages, aiPlaceholder],
    );

    String streamedText = "";
    final stream = _service.getAIStream(
      prompt: text,
      history: updatedMessages,
      attachments: userMsg.attachments,
    );

    await for (final chunk in stream) {
      streamedText += chunk;
      
      final tempMsgs = state.activeMessages.map((m) {
        if (m.id == aiMsgId) {
          return m.copyWith(text: streamedText, isLoading: false);
        }
        return m;
      }).toList();

      state = state.copyWith(
        activeMessages: tempMsgs,
        isThinking: false,
      );
    }

    await _service.saveMessages(convoId, state.activeMessages);

    if (isNewConvo) {
      final newConvo = ConversationModel(
        id: convoId,
        title: text.length > 25 ? '${text.substring(0, 25)}...' : text,
        date: DateTime.now(),
        preview: streamedText.length > 40 ? '${streamedText.substring(0, 40)}...' : streamedText,
      );
      final newList = [newConvo, ...state.conversations];
      state = state.copyWith(conversations: newList);
      await _service.saveConversations(newList);
    } else {
      final newList = state.conversations.map((c) {
        if (c.id == convoId) {
          return c.copyWith(
            preview: streamedText.length > 40 ? '${streamedText.substring(0, 40)}...' : streamedText,
            date: DateTime.now(),
          );
        }
        return c;
      }).toList();
      state = state.copyWith(conversations: newList);
      await _service.saveConversations(newList);
    }
  }

  Future<void> deleteConversation(String id) async {
    await _service.deleteConvo(id);
    final isDeletingActive = state.activeConversationId == id;
    
    state = state.copyWith(
      conversations: state.conversations.where((c) => c.id != id).toList(),
      activeConversationId: isDeletingActive ? null : state.activeConversationId,
      activeMessages: isDeletingActive ? [] : state.activeMessages,
    );
  }

  Future<void> renameConversation(String id, String newTitle) async {
    final newList = state.conversations.map((c) {
      if (c.id == id) {
        return c.copyWith(title: newTitle);
      }
      return c;
    }).toList();
    state = state.copyWith(conversations: newList);
    await _service.saveConversations(newList);
  }
}

final chatProvider = StateNotifierProvider<ChatNotifier, ChatState>((ref) {
  return ChatNotifier();
});
