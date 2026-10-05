import 'package:uuid/uuid.dart';

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
