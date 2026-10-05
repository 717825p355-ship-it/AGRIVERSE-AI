export interface FlutterFile {
  name: string;
  path: string;
  language: string;
  code: string;
  description: string;
}

export const FLUTTER_PROJECT_FILES: FlutterFile[] = [
  {
    name: "pubspec.yaml",
    path: "pubspec.yaml",
    language: "yaml",
    description: "Project metadata, dependencies, assets, and font configurations.",
    code: `name: agrigpt_assistant
description: "A complete Flutter Chat App for AgriGPT AI Agriculture Assistant."
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  
  # State Management
  flutter_riverpod: ^2.4.9
  riverpod_annotation: ^2.3.3

  # AI Integrations
  google_generative_ai: ^0.2.0

  # Rich UI & Formatting
  flutter_markdown: ^0.6.18
  lucide_icons: ^0.320.0
  google_fonts: ^6.1.0
  uuid: ^4.3.3
  intl: ^0.19.0

  # Media & Hardware
  image_picker: ^1.0.7
  file_picker: ^8.0.0
  camera: ^0.10.5+9

  # Voice & Speech
  speech_to_text: ^6.3.0
  flutter_tts: ^3.8.5

  # Utilities & Sharing
  share_plus: ^7.2.1
  flutter_animate: ^4.5.0
  shared_preferences: ^2.2.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  build_runner: ^2.4.8
  riverpod_generator: ^2.3.9

flutter:
  uses-material-design: true
  assets:
    - assets/images/
`
  },
  {
    name: "main.dart",
    path: "lib/main.dart",
    language: "dart",
    description: "The application bootstrap entry point initializing flutter state tree and provider scopes.",
    code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const ProviderScope(
      child: AgriGPTApp(),
    ),
  );
}
`
  },
  {
    name: "app.dart",
    path: "lib/app.dart",
    language: "dart",
    description: "Root widget defining basic MaterialApp settings, app theme configuration, and reactive dark mode triggers.",
    code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'theme/app_theme.dart';
import 'screens/chat_screen.dart';

class AgriGPTApp extends ConsumerWidget {
  const AgriGPTApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);

    return MaterialApp(
      title: 'AgriGPT',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeMode,
      home: const ChatScreen(),
    );
  }
}

// Global provider managing app light/dark state
final themeModeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.light);
`
  },
  {
    name: "colors.dart",
    path: "lib/theme/colors.dart",
    language: "dart",
    description: "Houses custom semantic brand colors for the green-and-white visual identity.",
    code: `import 'package:flutter/material.dart';

class AppColors {
  // Brand color scheme configuration
  static const Color primary = Color(0xFF059669); // Emerald 600
  static const Color secondary = Color(0xFF10B981); // Emerald 500
  static const Color accent = Color(0xFF34D399); // Emerald 400

  // Neutrals and background tokens
  static const Color lightBg = Color(0xFFF9FAFB);
  static const Color darkBg = Color(0xFF111827);
  static const Color darkSurface = Color(0xFF1F2937);
  static const Color borderLight = Color(0xFFE5E7EB);
}
`
  },
  {
    name: "typography.dart",
    path: "lib/theme/typography.dart",
    language: "dart",
    description: "Defines clean typographic pairs using Google's Plus Jakarta Sans for extreme legibility.",
    code: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTypography {
  static TextTheme textTheme(Brightness brightness) {
    final base = brightness == Brightness.light 
        ? ThemeData.light().textTheme 
        : ThemeData.dark().textTheme;
    return GoogleFonts.plusJakartaSansTextTheme(base);
  }
}
`
  },
  {
    name: "app_theme.dart",
    path: "lib/theme/app_theme.dart",
    language: "dart",
    description: "Defines Material Design 3 tokens, assembling colors and typography into Light and Dark themes.",
    code: `import 'package:flutter/material.dart';
import 'colors.dart';
import 'typography.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primary,
        brightness: Brightness.light,
        primary: AppColors.primary,
        secondary: AppColors.secondary,
        surface: Colors.white,
        background: AppColors.lightBg,
      ),
      scaffoldBackgroundColor: AppColors.lightBg,
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        iconTheme: IconThemeData(color: Colors.black80),
        centerTitle: false,
      ),
      textTheme: AppTypography.textTheme(Brightness.light),
      cardTheme: CardTheme(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.borderLight),
        ),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primary,
        brightness: Brightness.dark,
        primary: AppColors.primary,
        secondary: AppColors.accent,
        surface: AppColors.darkSurface,
        background: AppColors.darkBg,
      ),
      scaffoldBackgroundColor: AppColors.darkBg,
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.darkSurface,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        iconTheme: IconThemeData(color: Colors.white),
        centerTitle: false,
      ),
      textTheme: AppTypography.textTheme(Brightness.dark),
      cardTheme: CardTheme(
        color: AppColors.darkSurface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: Colors.grey.withOpacity(0.1)),
        ),
      ),
    );
  }
}
`
  },
  {
    name: "message.dart",
    path: "lib/models/message.dart",
    language: "dart",
    description: "Strongly typed representation of single chat messages, including attachment listings and loading states.",
    code: `import 'package:uuid/uuid.dart';

enum MessageRole { user, ai }

class ChatAttachment {
  final String id;
  final String name;
  final String path;
  final String type;

  ChatAttachment({
    required this.id,
    required this.name,
    required this.path,
    required this.type,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'path': path,
    'type': type,
  };

  factory ChatAttachment.fromJson(Map<String, dynamic> json) => ChatAttachment(
    id: json['id'] as String,
    name: json['name'] as String,
    path: json['path'] as String,
    type: json['type'] as String,
  );
}

class MessageModel {
  final String id;
  final MessageRole role;
  final String text;
  final DateTime timestamp;
  final bool isLoading;
  final List<ChatAttachment> attachments;
  final bool isLiked;
  final bool isDisliked;

  MessageModel({
    required this.id,
    required this.role,
    required this.text,
    required this.timestamp,
    this.isLoading = false,
    this.attachments = const [],
    this.isLiked = false,
    this.isDisliked = false,
  });

  MessageModel copyWith({
    String? id,
    MessageRole? role,
    String? text,
    DateTime? timestamp,
    bool? isLoading,
    List<ChatAttachment>? attachments,
    bool? isLiked,
    bool? isDisliked,
  }) {
    return MessageModel(
      id: id ?? this.id,
      role: role ?? this.role,
      text: text ?? this.text,
      timestamp: timestamp ?? this.timestamp,
      isLoading: isLoading ?? this.isLoading,
      attachments: attachments ?? this.attachments,
      isLiked: isLiked ?? this.isLiked,
      isDisliked: isDisliked ?? this.isDisliked,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'role': role.index,
    'text': text,
    'timestamp': timestamp.toIso8601String(),
    'attachments': attachments.map((a) => a.toJson()).toList(),
    'isLiked': isLiked,
    'isDisliked': isDisliked,
  };

  factory MessageModel.fromJson(Map<String, dynamic> json) => MessageModel(
    id: json['id'] as String,
    role: MessageRole.values[json['role'] as int],
    text: json['text'] as String,
    timestamp: DateTime.parse(json['timestamp'] as String),
    attachments: (json['attachments'] as List<dynamic>?)
            ?.map((a) => ChatAttachment.fromJson(a as Map<String, dynamic>))
            .toList() ?? const [],
    isLiked: json['isLiked'] as bool? ?? false,
    isDisliked: json['isDisliked'] as bool? ?? false,
  );
}
`
  },
  {
    name: "conversation.dart",
    path: "lib/models/conversation.dart",
    language: "dart",
    description: "Holds discussion session details, supporting history search, list updates, and title renames.",
    code: `class ConversationModel {
  final String id;
  final String title;
  final DateTime date;
  final String preview;

  ConversationModel({
    required this.id,
    required this.title,
    required this.date,
    required this.preview,
  });

  ConversationModel copyWith({
    String? id,
    String? title,
    DateTime? date,
    String? preview,
  }) {
    return ConversationModel(
      id: id ?? this.id,
      title: title ?? this.title,
      date: date ?? this.date,
      preview: preview ?? this.preview,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'date': date.toIso8601String(),
    'preview': preview,
  };

  factory ConversationModel.fromJson(Map<String, dynamic> json) => ConversationModel(
    id: json['id'] as String,
    title: json['title'] as String,
    date: DateTime.parse(json['date'] as String),
    preview: json['preview'] as String,
  );
}
`
  },
  {
    name: "constants.dart",
    path: "lib/utils/constants.dart",
    language: "dart",
    description: "Global read-only constants housing names, descriptions, storage keys, and standard suggestion queries.",
    code: `class AppConstants {
  static const String appName = "🌱 AgriGPT";
  static const String appSubtitle = "AI Agriculture Assistant";
  static const String conversationsKey = 'agrigpt_conversations';
  static const String messagesPrefix = 'agrigpt_msgs_';
  
  static const List<Map<String, String>> popularInquiries = [
    {'icon': '🌾', 'text': 'Best crop for my soil'},
    {'icon': '🐛', 'text': 'Identify plant disease'},
    {'icon': '💧', 'text': 'Irrigation advice'},
    {'icon': '🌦', 'text': 'Weather guidance'},
    {'icon': '💰', 'text': 'Government schemes'},
    {'icon': '🧪', 'text': 'Fertilizer recommendation'},
    {'icon': '🚜', 'text': 'Farm equipment'},
    {'icon': '📈', 'text': 'Market prices'},
  ];
}
`
  },
  {
    name: "voice_utils.dart",
    path: "lib/utils/voice_utils.dart",
    language: "dart",
    description: "Frictionless utility bridging Speech-to-Text inputs and Indo-English vocal synthesis.",
    code: `import 'package:speech_to_text/speech_to_text.dart' as stt;
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
`
  },
  {
    name: "gemini_service.dart",
    path: "lib/services/gemini_service.dart",
    language: "dart",
    description: "Direct connection handler with Google's Generative AI streaming endpoints, injecting strict system instructions.",
    code: `import 'package:google_generative_ai/google_generative_ai.dart';
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
          parts.add(TextPart("[Analyzed Image Attachment: \${att.name}]"));
        } else if (att.type == 'pdf') {
          parts.add(TextPart("[Analyzed PDF Document: \${att.name}]"));
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
      yield "Error connecting to AgriGPT: \${e.toString()}. Please check your internet connection and retry.";
    }
  }
}
`
  },
  {
    name: "chat_service.dart",
    path: "lib/services/chat_service.dart",
    language: "dart",
    description: "Main service bridge orchestrating the flow between local preferences database and remote Gemini stream client.",
    code: `import '../models/message.dart';
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
`
  },
  {
    name: "chat_repository.dart",
    path: "lib/repository/chat_repository.dart",
    language: "dart",
    description: "Caches conversational nodes locally on-disk using lightweight SharedPreferences encoding.",
    code: `import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/message.dart';
import '../models/conversation.dart';
import '../utils/constants.dart';

class ChatRepository {
  Future<void> saveConversations(List<ConversationModel> conversations) async {
    final prefs = await SharedPreferences.getInstance();
    final data = conversations.map((c) => c.toJson()).toList();
    await prefs.setString(AppConstants.conversationsKey, jsonEncode(data));
  }

  Future<List<ConversationModel>> loadConversations() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = prefs.getString(AppConstants.conversationsKey);
    if (jsonStr == null) return [];
    
    final List<dynamic> list = jsonDecode(jsonStr);
    return list.map((item) => ConversationModel.fromJson(item)).toList();
  }

  Future<void> saveMessages(String conversationId, List<MessageModel> messages) async {
    final prefs = await SharedPreferences.getInstance();
    final data = messages.map((m) => m.toJson()).toList();
    await prefs.setString('\${AppConstants.messagesPrefix}\$conversationId', jsonEncode(data));
  }

  Future<List<MessageModel>> loadMessages(String conversationId) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = prefs.getString('\${AppConstants.messagesPrefix}\$conversationId');
    if (jsonStr == null) return [];

    final List<dynamic> list = jsonDecode(jsonStr);
    return list.map((item) => MessageModel.fromJson(item)).toList();
  }

  Future<void> deleteConversation(String conversationId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('\${AppConstants.messagesPrefix}\$conversationId');
    
    final conversations = await loadConversations();
    final filtered = conversations.where((c) => c.id != conversationId).toList();
    await saveConversations(filtered);
  }
}
`
  },
  {
    name: "chat_provider.dart",
    path: "lib/providers/chat_provider.dart",
    language: "dart",
    description: "Riverpod state notifier managing conversations lists, searching, active screens, streams, and pending attachments.",
    code: `import 'package:flutter_riverpod/flutter_riverpod.dart';
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
        title: text.length > 25 ? '\${text.substring(0, 25)}...' : text,
        date: DateTime.now(),
        preview: streamedText.length > 40 ? '\${streamedText.substring(0, 40)}...' : streamedText,
      );
      final newList = [newConvo, ...state.conversations];
      state = state.copyWith(conversations: newList);
      await _service.saveConversations(newList);
    } else {
      final newList = state.conversations.map((c) {
        if (c.id == convoId) {
          return c.copyWith(
            preview: streamedText.length > 40 ? '\${streamedText.substring(0, 40)}...' : streamedText,
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
`
  },
  {
    name: "markdown_message.dart",
    path: "lib/widgets/markdown_message.dart",
    language: "dart",
    description: "Draws markdown paragraphs, lists, bold tables, and structured guidelines safely.",
    code: `import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';

class MarkdownMessage extends StatelessWidget {
  final String text;
  final bool isUser;
  final bool isDark;

  const MarkdownMessage({
    super.key,
    required this.text,
    required this.isUser,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    return MarkdownBody(
      data: text,
      styleSheet: MarkdownStyleSheet(
        p: TextStyle(
          color: isUser ? Colors.white : (isDark ? Colors.white : Colors.black80),
          fontSize: 15,
          height: 1.5,
        ),
        listBullet: TextStyle(
          color: isUser ? Colors.white : Colors.emerald,
        ),
        tableBody: const TextStyle(fontSize: 13),
      ),
    );
  }
}
`
  },
  {
    name: "chat_bubble.dart",
    path: "lib/widgets/chat_bubble.dart",
    language: "dart",
    description: "Displays beautifully padded bubbles with full response actions (regenerate, tts, copy, share).",
    code: `import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:flutter/services.dart';
import 'package:share_plus/share_plus.dart';
import '../models/message.dart';
import '../utils/voice_utils.dart';
import 'markdown_message.dart';

class ChatBubble extends StatelessWidget {
  final MessageModel message;
  final VoidCallback onRegenerate;

  const ChatBubble({
    super.key,
    required this.message,
    required this.onRegenerate,
  });

  bool get _isUser => message.role == MessageRole.user;

  void _copyToClipboard(BuildContext context) {
    Clipboard.setData(ClipboardData(text: message.text));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Advice copied to clipboard"), duration: Duration(seconds: 1)),
    );
  }

  void _shareMessage() {
    Share.share(message.text, subject: "Farming Wisdom from AgriGPT");
  }

  @override
  Widget build(BuildContext context) {
    final bubbleWidth = MediaQuery.of(context).size.width * 0.75;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: _isUser ? CrossAxisAlignment.end : CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: _isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (!_isUser) ...[
                const CircleAvatar(
                  backgroundColor: Color(0xFFE8F5E9),
                  radius: 16,
                  child: Text("🌱", style: TextStyle(fontSize: 14)),
                ),
                const SizedBox(width: 8),
              ],
              
              Flexible(
                child: Container(
                  constraints: BoxConstraints(maxWidth: bubbleWidth),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: _isUser
                        ? Colors.emerald
                        : (isDark ? Colors.grey[900] : Colors.white),
                    borderRadius: BorderRadius.only(
                      topLeft: const Radius.circular(16),
                      topRight: const Radius.circular(16),
                      bottomLeft: _isUser ? const Radius.circular(16) : Radius.zero,
                      bottomRight: _isUser ? Radius.zero : const Radius.circular(16),
                    ),
                    boxShadow: _isUser
                        ? []
                        : [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.04),
                              blurRadius: 6,
                              offset: const Offset(0, 3),
                            )
                          ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      MarkdownMessage(
                        text: message.text.isEmpty && message.isLoading ? "● ● ●" : message.text,
                        isUser: _isUser,
                        isDark: isDark,
                      ),

                      if (message.attachments.isNotEmpty) ...[
                        const SizedBox(height: 10),
                        ...message.attachments.map((att) {
                          return Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                att.type == 'image' ? LucideIcons.image : LucideIcons.fileText,
                                size: 14,
                                color: _isUser ? Colors.white70 : Colors.emerald,
                              ),
                              const SizedBox(width: 6),
                              Text(
                                att.name,
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: _isUser ? Colors.white70 : Colors.grey[600],
                                ),
                              ),
                            ],
                          );
                        }),
                      ],
                    ],
                  ),
                ),
              ),
            ],
          ),

          if (!_isUser && message.text.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(left: 40, top: 4),
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(LucideIcons.thumbsUp, size: 14),
                    color: message.isLiked ? Colors.emerald : Colors.grey,
                    onPressed: () {},
                  ),
                  IconButton(
                    icon: const Icon(LucideIcons.thumbsDown, size: 14),
                    color: message.isDisliked ? Colors.red : Colors.grey,
                    onPressed: () {},
                  ),
                  IconButton(
                    icon: const Icon(LucideIcons.copy, size: 14, color: Colors.grey),
                    onPressed: () => _copyToClipboard(context),
                  ),
                  IconButton(
                    icon: const Icon(LucideIcons.volume2, size: 14, color: Colors.grey),
                    onPressed: () => VoiceUtils.speak(message.text),
                  ),
                  IconButton(
                    icon: const Icon(LucideIcons.refreshCw, size: 14, color: Colors.grey),
                    onPressed: onRegenerate,
                  ),
                  IconButton(
                    icon: const Icon(LucideIcons.share2, size: 14, color: Colors.grey),
                    onPressed: _shareMessage,
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
`
  },
  {
    name: "typing_indicator.dart",
    path: "lib/widgets/typing_indicator.dart",
    language: "dart",
    description: "Displays custom flashing indicators while Gemini Streams its response.",
    code: `import 'package:flutter/material.dart';

class TypingIndicator extends StatefulWidget {
  const TypingIndicator({super.key});

  @override
  State<TypingIndicator> createState() => _TypingIndicatorState();
}

class _TypingIndicatorState extends State<TypingIndicator> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Theme.of(context).brightness == Brightness.dark
            ? Colors.grey[900]
            : Colors.white,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(16),
          topRight: Radius.circular(16),
          bottomRight: Radius.circular(16),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 6,
            offset: const Offset(0, 3),
          )
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            "AgriGPT is thinking  ",
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: Colors.grey),
          ),
          AnimatedBuilder(
            animation: _controller,
            builder: (ctx, child) {
              final double value = _controller.value;
              return Row(
                children: List.generate(3, (index) {
                  final double delay = index * 0.2;
                  double opacity = (value - delay) % 1.0;
                  if (opacity < 0) opacity += 1.0;
                  opacity = opacity > 0.5 ? (1.0 - opacity) * 2 : opacity * 2;

                  return Container(
                    margin: const EdgeInsets.symmetric(horizontal: 2),
                    width: 6,
                    height: 6,
                    decoration: BoxDecoration(
                      color: Colors.emerald.withOpacity(opacity.clamp(0.2, 1.0)),
                      shape: BoxShape.circle,
                    ),
                  );
                }),
              );
            },
          ),
        ],
      ),
    );
  }
}
`
  },
  {
    name: "suggestion_chips.dart",
    path: "lib/widgets/suggestion_chips.dart",
    language: "dart",
    description: "Renders rapid clickable cards to guide common questions instantly.",
    code: `import 'package:flutter/material.dart';
import '../utils/constants.dart';

class SuggestionChips extends StatelessWidget {
  final Function(String) onSuggestionSelected;

  const SuggestionChips({
    super.key,
    required this.onSuggestionSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 10,
      children: AppConstants.popularInquiries.map((sug) {
        return InkWell(
          onTap: () => onSuggestionSelected(sug['text']!),
          borderRadius: BorderRadius.circular(20),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: Theme.of(context).brightness == Brightness.dark
                  ? Colors.grey[900]
                  : Colors.emerald.withOpacity(0.04),
              border: Border.all(
                color: Colors.emerald.withOpacity(0.15),
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(sug['icon']!, style: const TextStyle(fontSize: 16)),
                const SizedBox(width: 8),
                Text(
                  sug['text']!,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Theme.of(context).brightness == Brightness.dark
                        ? Colors.white
                        : Colors.emerald[900],
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}
`
  },
  {
    name: "app_bar_widget.dart",
    path: "lib/widgets/app_bar_widget.dart",
    language: "dart",
    description: "Draws structured responsive navigation tools, displaying New Chat and toggle mode buttons.",
    code: `import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../utils/constants.dart';

class AppBarWidget extends StatelessWidget implements PreferredSizeWidget {
  final VoidCallback onNewChat;
  final VoidCallback onHistoryPressed;
  final VoidCallback onThemeToggle;
  final ThemeMode currentThemeMode;
  final bool showHistoryIcon;

  const AppBarWidget({
    super.key,
    required this.onNewChat,
    required this.onHistoryPressed,
    required this.onThemeToggle,
    required this.currentThemeMode,
    this.showHistoryIcon = true,
  });

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            AppConstants.appName,
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
          ),
          Text(
            AppConstants.appSubtitle,
            style: TextStyle(
              fontSize: 12,
              color: Theme.of(context).brightness == Brightness.dark
                  ? Colors.white70
                  : Colors.black54,
            ),
          ),
        ],
      ),
      actions: [
        IconButton(
          icon: const Icon(LucideIcons.plusCircle),
          tooltip: "New Chat",
          onPressed: onNewChat,
        ),
        if (showHistoryIcon)
          IconButton(
            icon: const Icon(LucideIcons.history),
            tooltip: "Chat History",
            onPressed: onHistoryPressed,
          ),
        IconButton(
          icon: Icon(currentThemeMode == ThemeMode.light ? LucideIcons.moon : LucideIcons.sun),
          tooltip: "Toggle Light/Dark",
          onPressed: onThemeToggle,
        ),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
`
  },
  {
    name: "attachment_menu.dart",
    path: "lib/widgets/attachment_menu.dart",
    language: "dart",
    description: "Renders the visual modal sheet supporting gallery imports, camera captures, and PDF upload choices.",
    code: `import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class AttachmentMenu extends StatelessWidget {
  final VoidCallback onGalleryTap;
  final VoidCallback onCameraTap;
  final VoidCallback onPdfTap;

  const AttachmentMenu({
    super.key,
    required this.onGalleryTap,
    required this.onCameraTap,
    required this.onPdfTap,
  });

  Widget _attachmentBtn(
    BuildContext context, {
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(15),
      child: Container(
        width: 80,
        padding: const EdgeInsets.symmetric(vertical: 12),
        child: Column(
          children: [
            CircleAvatar(
              backgroundColor: color.withOpacity(0.1),
              radius: 24,
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(height: 8),
            Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            "Upload File / Attachment",
            style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _attachmentBtn(
                context,
                icon: LucideIcons.image,
                label: "Gallery",
                color: Colors.emerald,
                onTap: onGalleryTap,
              ),
              _attachmentBtn(
                context,
                icon: LucideIcons.camera,
                label: "Camera",
                color: Colors.blue,
                onTap: onCameraTap,
              ),
              _attachmentBtn(
                context,
                icon: LucideIcons.fileText,
                label: "PDF",
                color: Colors.red,
                onTap: onPdfTap,
              ),
            ],
          ),
          const SizedBox(height: 10),
        ],
      ),
    );
  }
}
`
  },
  {
    name: "empty_chat.dart",
    path: "lib/widgets/empty_chat.dart",
    language: "dart",
    description: "Draws visual introductory instructions and popular suggestions inside a clean centered panel.",
    code: `import 'package:flutter/material.dart';
import 'suggestion_chips.dart';

class EmptyChat extends StatelessWidget {
  final Function(String) onSuggestionSelected;

  const EmptyChat({
    super.key,
    required this.onSuggestionSelected,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const SizedBox(height: 50),
          const CircleAvatar(
            radius: 40,
            backgroundColor: Color(0xFFE8F5E9),
            child: Text(
              "🌱",
              style: TextStyle(fontSize: 40),
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            "Welcome to AgriGPT",
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.black, tracking: -0.5),
          ),
          const SizedBox(height: 8),
          const Text(
            "\"What would you like to know today?\"",
            style: TextStyle(fontSize: 14, fontStyle: FontStyle.italic, color: Colors.grey),
          ),
          const SizedBox(height: 40),
          Align(
            alignment: Alignment.centerLeft,
            child: Text(
              "Popular Agri-Inquiries",
              style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(height: 12),
          SuggestionChips(
            onSuggestionSelected: onSuggestionSelected,
          ),
        ],
      ),
    );
  }
}
`
  },
  {
    name: "message_input.dart",
    path: "lib/widgets/message_input.dart",
    language: "dart",
    description: "Bottom visual toolbar enclosing speech triggers, text entry form, and attach triggers.",
    code: `import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class MessageInput extends StatelessWidget {
  final TextEditingController controller;
  final VoidCallback onSend;
  final VoidCallback onAttach;
  final VoidCallback onVoiceInput;
  final bool isSpeechListening;
  final ValueChanged<String> onChanged;

  const MessageInput({
    super.key,
    required this.controller,
    required this.onSend,
    required this.onAttach,
    required this.onVoiceInput,
    required this.isSpeechListening,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        border: Border(
          top: BorderSide(
            color: Colors.grey.withOpacity(0.1),
          ),
        ),
      ),
      child: SafeArea(
        child: Row(
          children: [
            IconButton(
              icon: const Icon(LucideIcons.paperclip, color: Colors.grey),
              tooltip: "Attach PDF, Image, or Camera Scan",
              onPressed: onAttach,
            ),
            
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: Theme.of(context).brightness == Brightness.dark
                      ? Colors.grey[900]
                      : Colors.grey[100],
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.grey.withOpacity(0.15)),
                ),
                child: Row(
                  children: [
                    const SizedBox(width: 16),
                    Expanded(
                      child: TextField(
                        controller: controller,
                        onChanged: onChanged,
                        onSubmitted: (_) => onSend(),
                        decoration: const InputDecoration(
                          hintText: "Ask anything about farming...",
                          border: InputBorder.none,
                          isDense: true,
                        ),
                      ),
                    ),
                    
                    IconButton(
                      icon: Icon(
                        isSpeechListening ? LucideIcons.micOff : LucideIcons.mic,
                        color: isSpeechListening ? Colors.red : Colors.grey,
                      ),
                      onPressed: onVoiceInput,
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                    ),
                    const SizedBox(width: 8),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 8),
            
            CircleAvatar(
              backgroundColor: controller.text.trim().isNotEmpty
                  ? Colors.emerald
                  : Colors.grey.withOpacity(0.2),
              radius: 20,
              child: IconButton(
                icon: const Icon(LucideIcons.navigation, color: Colors.white, size: 16),
                onPressed: controller.text.trim().isNotEmpty ? onSend : null,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`
  },
  {
    name: "chat_screen.dart",
    path: "lib/screens/chat_screen.dart",
    language: "dart",
    description: "Primary chat controller coordinating suggestions triggers, historical drawers, thinking nodes, and visual uploads indicators.",
    code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../providers/chat_provider.dart';
import '../app.dart';
import 'history_screen.dart';
import '../widgets/chat_bubble.dart';
import '../widgets/typing_indicator.dart';
import '../widgets/empty_chat.dart';
import '../widgets/attachment_menu.dart';
import '../widgets/message_input.dart';
import '../widgets/app_bar_widget.dart';
import '../utils/voice_utils.dart';

class ChatScreen extends ConsumerStatefulWidget {
  const ChatScreen({super.key});

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final TextEditingController _inputController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isSpeechListening = false;

  @override
  void dispose() {
    _inputController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 350),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _handleSend() {
    final txt = _inputController.text;
    if (txt.trim().isEmpty) return;
    
    ref.read(chatProvider.notifier).sendMessage(txt);
    _inputController.clear();
    _scrollToBottom();
  }

  void _handleSuggestionClick(String suggestion) {
    ref.read(chatProvider.notifier).sendMessage(suggestion);
    _scrollToBottom();
  }

  Future<void> _handleVoiceInput() async {
    final hasSpeech = await VoiceUtils.initializeSpeech();
    if (hasSpeech) {
      setState(() => _isSpeechListening = true);
      VoiceUtils.startListening((transcription) {
        setState(() {
          _inputController.text = transcription;
          _isSpeechListening = false;
        });
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Voice Recognition is not supported or permission denied.")),
      );
    }
  }

  void _showAttachmentMenu() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return AttachmentMenu(
          onGalleryTap: () {
            Navigator.pop(ctx);
            ref.read(chatProvider.notifier).addAttachment("crop_health.jpg", "/cache/crop_health.jpg", "image");
          },
          onCameraTap: () {
            Navigator.pop(ctx);
            ref.read(chatProvider.notifier).addAttachment("leaf_disease.png", "/cache/leaf_disease.png", "image");
          },
          onPdfTap: () {
            Navigator.pop(ctx);
            ref.read(chatProvider.notifier).addAttachment("soil_test_results.pdf", "/cache/soil_test.pdf", "pdf");
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final chatState = ref.watch(chatProvider);
    final themeMode = ref.watch(themeModeProvider);
    final isLargeScreen = MediaQuery.of(context).size.width > 900;

    Widget mainChatArea = Column(
      children: [
        Expanded(
          child: chatState.activeMessages.isEmpty
              ? EmptyChat(onSuggestionSelected: _handleSuggestionClick)
              : RefreshIndicator(
                  color: Colors.emerald,
                  onRefresh: () async {
                    await Future.delayed(const Duration(seconds: 1));
                  },
                  child: ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
                    itemCount: chatState.activeMessages.length,
                    itemBuilder: (ctx, idx) {
                      final msg = chatState.activeMessages[idx];
                      return ChatBubble(
                        message: msg,
                        onRegenerate: () {
                          ref.read(chatProvider.notifier).sendMessage(msg.text);
                        },
                      );
                    },
                  ),
                ),
        ),

        if (chatState.isThinking)
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 24, vertical: 8),
            child: Align(
              alignment: Alignment.centerLeft,
              child: TypingIndicator(),
            ),
          ),

        if (chatState.pendingAttachments.isNotEmpty)
          Container(
            height: 60,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: chatState.pendingAttachments.map((att) {
                return Card(
                  color: Colors.emerald.withOpacity(0.05),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  margin: const EdgeInsets.only(right: 8, bottom: 8),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          att.type == 'image' ? LucideIcons.image : LucideIcons.fileText,
                          size: 16,
                          color: Colors.emerald,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          att.name,
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                        IconButton(
                          icon: const Icon(LucideIcons.x, size: 14, color: Colors.red),
                          onPressed: () {
                            ref.read(chatProvider.notifier).removePendingAttachment(att.id);
                          },
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
          ),

        MessageInput(
          controller: _inputController,
          onSend: _handleSend,
          onAttach: _showAttachmentMenu,
          onVoiceInput: _handleVoiceInput,
          isSpeechListening: _isSpeechListening,
          onChanged: (val) => setState(() {}),
        ),
      ],
    );

    return Scaffold(
      appBar: AppBarWidget(
        onNewChat: () {
          ref.read(chatProvider.notifier).startNewChat();
        },
        onHistoryPressed: () {
          Scaffold.of(context).openEndDrawer();
        },
        onThemeToggle: () {
          ref.read(themeModeProvider.notifier).state =
              themeMode == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
        },
        currentThemeMode: themeMode,
        showHistoryIcon: !isLargeScreen,
      ),
      endDrawer: !isLargeScreen
          ? const Drawer(
              child: HistoryScreen(),
            )
          : null,
      body: isLargeScreen
          ? Row(
              children: [
                const SizedBox(
                  width: 300,
                  child: HistoryScreen(),
                ),
                const VerticalDivider(width: 1),
                Expanded(child: mainChatArea),
              ],
            )
          : mainChatArea,
    );
  }
}
`
  },
  {
    name: "history_screen.dart",
    path: "lib/screens/history_screen.dart",
    language: "dart",
    description: "Sidepane displaying search bars and directory logs for past conversation histories.",
    code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../providers/chat_provider.dart';

class HistoryScreen extends ConsumerWidget {
  const HistoryScreen({super.key});

  void _showRenameDialog(BuildContext context, WidgetRef ref, String id, String currentTitle) {
    final controller = TextEditingController(text: currentTitle);
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: const Text("Rename Chat"),
          content: TextField(
            controller: controller,
            decoration: const InputDecoration(labelText: "New Title"),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text("Cancel"),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.emerald),
              onPressed: () {
                ref.read(chatProvider.notifier).renameConversation(id, controller.text);
                Navigator.pop(ctx);
              },
              child: const Text("Rename"),
            ),
          ],
        );
      },
    );
  }

  void _showDeleteDialog(BuildContext context, WidgetRef ref, String id) {
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: const Text("Delete Chat?"),
          content: const Text("Are you sure you want to delete this agriculture session? This cannot be undone."),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text("Cancel"),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
              onPressed: () {
                ref.read(chatProvider.notifier).deleteConversation(id);
                Navigator.pop(ctx);
              },
              child: const Text("Delete"),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final chatState = ref.watch(chatProvider);
    final conversations = ref.read(chatProvider.notifier).filteredConversations;

    return Container(
      color: Theme.of(context).brightness == Brightness.dark
          ? Colors.black.withOpacity(0.2)
          : Colors.grey[50],
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                const Icon(LucideIcons.history, color: Colors.emerald),
                const SizedBox(width: 8),
                Text(
                  "Farming Logs",
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),

          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, bottom: 10),
            child: TextField(
              onChanged: (val) {
                ref.read(chatProvider.notifier).updateSearch(val);
              },
              decoration: InputDecoration(
                hintText: "Search conversations...",
                prefixIcon: const Icon(LucideIcons.search, size: 16),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey.withOpacity(0.2)),
                ),
                contentPadding: const EdgeInsets.symmetric(vertical: 8),
                isDense: true,
              ),
            ),
          ),

          Expanded(
            child: conversations.isEmpty
                ? const Center(
                    child: Text("No conversations found", style: TextStyle(color: Colors.grey)),
                  )
                : ListView.builder(
                    itemCount: conversations.length,
                    itemBuilder: (ctx, idx) {
                      final convo = conversations[idx];
                      final isActive = chatState.activeConversationId == convo.id;

                      return ListTile(
                        selected: isActive,
                        selectedTileColor: Colors.emerald.withOpacity(0.08),
                        leading: const Icon(LucideIcons.messageSquare, size: 18),
                        title: Text(
                          convo.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                            fontSize: 14,
                            color: isActive ? Colors.emerald : null,
                          ),
                        ),
                        subtitle: Text(
                          convo.preview,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontSize: 12),
                        ),
                        onTap: () {
                          ref.read(chatProvider.notifier).selectConversation(convo.id);
                          if (Scaffold.of(context).isEndDrawerOpen) {
                            Navigator.pop(context);
                          }
                        },
                        trailing: PopupMenuButton<String>(
                          onSelected: (action) {
                            if (action == 'rename') {
                              _showRenameDialog(context, ref, convo.id, convo.title);
                            } else if (action == 'delete') {
                              _showDeleteDialog(context, ref, convo.id);
                            }
                          },
                          itemBuilder: (ctx) => [
                            const PopupMenuItem(
                              value: 'rename',
                              child: Row(
                                children: [
                                  Icon(LucideIcons.edit, size: 16),
                                  SizedBox(width: 8),
                                  Text("Rename"),
                                ],
                              ),
                            ),
                            const PopupMenuItem(
                              value: 'delete',
                              child: Row(
                                children: [
                                  Icon(LucideIcons.trash2, size: 16, color: Colors.red),
                                  SizedBox(width: 8),
                                  Text("Delete", style: TextStyle(color: Colors.red)),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
`
  },
  {
    name: "AndroidManifest.xml",
    path: "android/app/src/main/AndroidManifest.xml",
    language: "xml",
    description: "Android manifest specifying permissions for camera, microphone, storage, internet, and main launch Activity.",
    code: `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.agrigpt.assistant">

    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.CAMERA"/>
    <uses-permission android:name="android.permission.RECORD_AUDIO"/>
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>

    <application
        android:label="AgriGPT"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme"
              />
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>
`
  },
  {
    name: "build.gradle (Project)",
    path: "android/build.gradle",
    language: "groovy",
    description: "Top-level Gradle configuration file for Android target platform dependencies.",
    code: `buildscript {
    ext.kotlin_version = '1.9.0'
    repositories {
        google()
        mavenCentral()
    }

    dependencies {
        classpath 'com.android.tools.build:gradle:8.1.0'
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:\$kotlin_version"
        classpath 'com.google.gms:google-services:4.3.15'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.buildDir = '../build'
subprojects {
    project.buildDir = "\${rootProject.buildDir}/\${project.name}"
}
subprojects {
    project.evaluationDependsOn(':app')
}

tasks.register("clean", Delete) {
    delete rootProject.buildDir
}
`
  },
  {
    name: "build.gradle (App)",
    path: "android/app/build.gradle",
    language: "groovy",
    description: "App-level Gradle configuration setting package ID, minimum/target SDKs, and dependencies.",
    code: `plugins {
    id "com.android.application"
    id "kotlin-android"
    id "dev.flutter.flutter-gradle-plugin"
}

def localProperties = new Properties()
def localPropertiesFile = rootProject.file('local.properties')
if (localPropertiesFile.exists()) {
    localPropertiesFile.load(localPropertiesFile.newDataInputStream())
}

def flutterVersionCode = localProperties.getProperty('flutter.versionCode')
if (flutterVersionCode == null) {
    flutterVersionCode = '1'
}

def flutterVersionName = localProperties.getProperty('flutter.versionName')
if (flutterVersionName == null) {
    flutterVersionName = '1.0'
}

android {
    namespace "com.agrigpt.assistant"
    compileSdk 34
    ndkVersion flutter.ndkVersion

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = '17'
    }

    defaultConfig {
        applicationId "com.agrigpt.assistant"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
    }

    buildTypes {
        release {
            signingConfig signingConfigs.debug
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

flutter {
    source '../..'
}

dependencies {
    implementation "org.jetbrains.kotlin:kotlin-stdlib:\$kotlin_version"
}
`
  },
  {
    name: "settings.gradle",
    path: "android/settings.gradle",
    language: "groovy",
    description: "Android Gradle settings including Flutter plugin loader.",
    code: `pluginManagement {
    def flutterSdkPath = {
        def properties = new Properties()
        def file = new File(rootProject.projectDir, "local.properties")
        if (file.exists()) {
            file.withReader("UTF-8") { reader -> properties.load(reader) }
        }
        def flutterSdkPath = properties.getProperty("flutter.sdk")
        assert flutterSdkPath != null, "flutter.sdk not set in local.properties"
        return flutterSdkPath
    }()

    includeBuild("\$flutterSdkPath/packages/flutter_tools/gradle")

    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

plugins {
    id "dev.flutter.flutter-plugin-loader" version "1.0.0"
    id "com.android.application" version "8.1.0" apply false
    id "org.jetbrains.kotlin.android" version "1.9.0" apply false
}

include ":app"
`
  },
  {
    name: "MainActivity.kt",
    path: "android/app/src/main/kotlin/com/agrigpt/assistant/MainActivity.kt",
    language: "kotlin",
    description: "Main Flutter Activity Kotlin entrypoint for Android.",
    code: `package com.agrigpt.assistant

import io.flutter.embedding.android.FlutterActivity

class MainActivity: FlutterActivity() {
}
`
  }
];
