module.exports = class ApplicationPolicy {
  constructor(user, wiki) {
    this.user = user;
    this.wiki = wiki;
  }

  _isAdmin() {
    return this.user.role === 2;
  }

  _isPremium() {
    return this.user.role === 1;
  }

  _isOwner() {
    return this.wiki && (this.user.id == this.wiki.userId);
  }

  show() {
    return !this.wiki.private || (this._isOwner() || this._isAdmin());
  }

  new() {
    return this.user != null;
  }

  create() {
    return this.new();
  }

  edit() {
    return this.new &&
      (this.wiki && (this._isOwner() || this._isAdmin()));
  }

  update() {
    return this.edit();
  }

  delete() {
    return this.update();
  }

}
