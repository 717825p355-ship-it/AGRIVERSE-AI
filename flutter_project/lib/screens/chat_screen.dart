import 'package:flutter/material.dart';
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
