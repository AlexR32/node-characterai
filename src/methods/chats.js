const Method = require('../types/method');
const { v4: uuidv4 } = require('uuid');

class Chats extends Method {
  async create(charId, chatId, creatorId, greeting) {
    chatId ||= uuidv4();
    creatorId ||= this.client.me.user.id.toString();
    greeting ||= true;

    const data = await this.client.ws.send('create_chat', {
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

  async recents() {
    const data = await this.client.utils.request('get', 'chats/recent/', null, true);
    return data.chats;
  }

  async recent(char) {
    const data = await this.client.utils.request('get', `chats/recent/${char}`, null, true);
    return data.chats;
  }

  async histories(char, preview = 2) {
    const data = await this.client.utils.request('get', `chats/?character_ids=${char}&num_preview_turns=${preview}`, null, true);
    return data.chats;
  }

  async history(chatId, nextToken) {
    const data = await this.client.utils.request('get', `turns/${chatId}/?next_token=${nextToken}`, null, true);
    return data;
  }

  async voted(externalId) {
    const data = await this.client.utils.request('get', `chat/character/${externalId}/voted/`);

    return data.voted;
  }

  async vote(externalId, vote = null) {
    const data = await this.client.utils.request('post', 'chat/character/vote', {
      external_id: externalId,
      vote: vote,
    });

    return data;
  }

  async pin(pinned, chatId, turnId) {
    const data = await this.client.ws.send('set_turn_pin', {
      'is_pinned': pinned,
      'turn_key': {
        'chat_id': chatId,
        'turn_id': turnId,
      },
    });

    return data.turn;
  }

  // async updateVoice() {
  //   // https://plus.character.ai/chat/character/${externalId}/voice_override/update/ post
  // }

  // TODO: make message class
  async sendMessage(chat, text) {
    const turnKey = { 'chat_id': chat.chat_id };

    // if (customId) {
    //   turnKey.turn_id = customId;
    // }

    const response = await this.client.ws.send('create_and_generate_turn', {
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
    const data = await this.client.ws.send('edit_turn_candidate', {
      // 'current_candidate_id': 'old candidate id here',
      'new_candidate_raw_content': text,
      'turn_key': {
        'chat_id': chatId,
        'turn_id': messageId,
      },
    });

    if (!data.turn) {
      throw new Error(data.comment);
    }

    return data.turn;
  }

  async deleteMessages(chatId, ids) {
    const data = await this.client.ws.send('remove_turns', {
      'chat_id': chatId,
      'turn_ids': ids,
    });

    if (data.command === 'neo_error') {
      throw new Error(data.comment);
    }

    return true;
  }

  async nextMessage(char, chatId, turnId) {
    const data = await this.client.ws.send('generate_turn_candidate', {
      'character_id': char,
      'previous_annotations': {
        'boring': 0,
        'not_boring': 0,
        'inaccurate': 0,
        'not_inaccurate': 0,
        'repetitive': 0,
        'not_repetitive': 0,
        'out_of_character': 0,
        'not_out_of_character': 0,
        'bad_memory': 0,
        'not_bad_memory': 0,
        'long': 0,
        'not_long': 0,
        'short': 0,
        'not_short': 0,
        'ends_chat_early': 0,
        'not_ends_chat_early': 0,
        'funny': 0,
        'not_funny': 0,
        'interesting': 0,
        'not_interesting': 0,
        'helpful': 0,
        'not_helpful': 0,
      },
      'selected_language': '',
      'tts_enabled': false,
      'turn_key': {
        'turn_id': turnId,
        'chat_id': chatId,
      },
      'user_name': this.client.me.name,
    });

    if (!data.turn) {
      throw new Error(data.comment);
    }

    return data.turn;
  }
}

module.exports = Chats;
