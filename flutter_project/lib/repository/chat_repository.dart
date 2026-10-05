import 'dart:convert';
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
    await prefs.setString('${AppConstants.messagesPrefix}$conversationId', jsonEncode(data));
  }

  Future<List<MessageModel>> loadMessages(String conversationId) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = prefs.getString('${AppConstants.messagesPrefix}$conversationId');
    if (jsonStr == null) return [];

    final List<dynamic> list = jsonDecode(jsonStr);
    return list.map((item) => MessageModel.fromJson(item)).toList();
  }

  Future<void> deleteConversation(String conversationId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('${AppConstants.messagesPrefix}$conversationId');
    
    final conversations = await loadConversations();
    final filtered = conversations.where((c) => c.id != conversationId).toList();
    await saveConversations(filtered);
  }
}
