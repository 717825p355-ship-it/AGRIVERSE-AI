import 'package:flutter/material.dart';
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
