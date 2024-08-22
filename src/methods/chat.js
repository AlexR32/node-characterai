const Method = require('./../types/method');
const { v4: uuidv4 } = require('uuid');

class Chat extends Method {
  async getHistories(char, preview = 2) {
    const data = await this.client.utils.request('get', `chats/?character_ids=${char}&num_preview_turns=${preview}`, null, true);
    return data.chats;
  }

  async getHistory(chatId, nextToken) {
    const data = await this.client.utils.request('get', `turns/${chatId}/?next_token=${nextToken}`, null, true);
    return data;
  }

  async getChat(char) {
    const data = await this.client.utils.request('get', `chats/recent/${char}`, null, true);
    return data.chats[0];
  }

  async pin(pinned, chatId, turnId) {
    const data = await this.client.utils.request('post', 'turn/pin', {
      'is_pinned': pinned,
      'turn_key': {
        'chat_id': chatId,
        'turn_id': turnId,
      },
    }, true);

    return data.turn;
  }

  async deleteMessage(chatId, ids) {
    const data = await this.client.ws.sendAndReceive('remove_turns', {
      'chat_id': chatId,
      'turn_ids': ids,
    });

    if (data.command === 'neo_error') {
      throw new Error(data.comment);
    }

    return true;
  }

  async nextMessage(char, chatId, turnId, tts, lang) {
    const data = await this.client.ws.sendAndReceive('generate_turn_candidate', {
      'tts_enabled': tts,
      'selected_language': lang,
      'character_id': char,
      'turn_key': {
        'turn_id': turnId,
        'chat_id': chatId,
      },
    });

    if (!data.turn) {
      throw new Error(data.comment);
    }

    return data.turn;
  }

  async newChat(charId, chatId, creatorId, greeting) {
    chatId ||= uuidv4();
    creatorId ||= this.client.account.me.user.id.toString();
    greeting ||= true;

    const data = await this.client.ws.sendAndReceive('create_chat', {
      'chat': {
        'chat_id': chatId,
        'creator_id': creatorId,
        'visibility': 'VISIBILITY_PRIVATE',
        'character_id': charId,
        'type': 'TYPE_ONE_ON_ONE',
      },
      'with_greeting': greeting,
    });

    if (!data.chat) {
      throw new Error(data.comment);
    }

    // greeting message
    // const answer = await this.client.ws.asyncOn('message');
    return data.chat;
  }

  async sendMessage(chat, text) {
    const turnKey = { 'chat_id': chat.chat_id };

    // if (customId) {
    //   turnKey.turn_id = customId;
    // }

    const response = await this.client.ws.sendAndReceive('create_and_generate_turn', {
      'character_id': chat.character_id,
      'turn': {
        'turn_key': turnKey,
        // 'author': author || {},
        'candidates': [
          {
            'raw_content': text,
            // 'tti_image_rel_path': image,
          },
        ],
      },
    }, (data) => {
      // return false;
      if (!data.turn) throw new Error(data.comment);
      if (data.turn.author.is_human) return false;
      return data.turn.candidates[0].is_final;
    });

    return response.turn;
  }

  async editMessage(chatId, messageId, text) {
    const data = await this.client.ws.sendAndReceive('edit_turn_candidate', {
      'turn_key': {
        'chat_id': chatId,
        'turn_id': messageId,
      },
      'new_candidate_raw_content': text,
    });

    if (!data.turn) {
      throw new Error(data.comment);
    }

    return data.turn;
  }
}

module.exports = Chat;
