import 'package:flutter/material.dart';
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
