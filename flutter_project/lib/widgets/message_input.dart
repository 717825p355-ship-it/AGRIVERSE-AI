import 'package:flutter/material.dart';
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
