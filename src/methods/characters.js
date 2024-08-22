const Method = require('./../types/method');
const { v4: uuidv4 } = require('uuid');

class Characters extends Method {
  async getChar(externalId) {
    const data = await this.client.utils.request('post', 'chat/character/info/', {
      external_id: externalId,
    });
    return data.character;
  }

  async upvoted() {
    const data = await this.client.utils.request('get', 'chat/user/characters/upvoted/');
    return data.characters;
  }

  async getCategory(name) {
    const data = await this.client.utils.request('get', 'chat/curated_categories/characters/');
    if (name) return data.characters_by_curated_category[name];
    return data.characters_by_curated_category;
  }

  async getRecommended() {
    const data = await this.client.utils.request('get', 'chat/characters/trending/');
    return data.trending_characters;
  }

  async getTrending() {
    const data = await this.client.utils.request('get', 'recommendation/v1/user', null, true);
    return data.character;
  }

  async createChar(name, greeting, tgt, title, visibility, copyable, description, definition, avatarPath) {
    tgt ||= `id:${uuidv4()}`;

    const data = await this.client.utils.request('post', 'chat/character/create/', {
      'title': title,
      'name': name,
      'identifier': tgt,
      'visibility': visibility,
      'copyable': copyable,
      'description': description,
      'greeting': greeting,
      'definition': definition,
      'avatar_rel_path': avatarPath,
    });

    return data.character;
  }

  async updateChar(char, greeting, name, title, visibility, copyable, description, definition, default_voice_id, voice_id, strip_img_prompt_from_msg, base_img_prompt, img_gen_enabled, avatar_rel_path, categories, archived) {
    const info = this.getChar(char);

    const data = await this.client.utils.request('post', 'chat/character/update/', {
      'external_id': char || info.external_id.external_id,
      'name': name || info.name,
      'greeting': greeting || info.greeting,
      'title': title || info.title,
      'visibility': visibility || info.visibility,
      'copyable': copyable || info.copyable,
      'description': description || info.description,
      'definition': definition || info.definition,
      'default_voice_id': default_voice_id || info.default_voice_id,
      'voice_id': voice_id || info.voice_id,
      'strip_img_prompt_from_msg': strip_img_prompt_from_msg || info.strip_img_prompt_from_msg,
      'base_img_prompt': base_img_prompt || info.base_img_prompt,
      'img_gen_enabled': img_gen_enabled || info.img_gen_enabled,
      'avatar_rel_path': avatar_rel_path || info.avatar_file_name,
      'categories': categories || [],
      'archived': archived || null,
    });

    return data.character;
  }
}


module.exports = Characters;
