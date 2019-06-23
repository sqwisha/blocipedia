module.exports = class ApplicationPolicy {
  constructor(user, wiki) {
    this.user = user;
    this.wiki = wiki;
    if (wiki && wiki.collaborators) {
      this.collaborators = wiki.collaborators.map((collaborator) => {
        return collaborator.userId;
      });
    } else {
      this.collaborators = [];
    }
  }

  _isAdmin() {
    return this.user.role === 2;
  }

  _isPremium() {
    return this.user.role === 1;
  }

  _isOwner() {
    return this.wiki && this.user && (this.user.id == this.wiki.userId);
  }

  _isCollaborator() {
    return this.new() && this.collaborators.indexOf(this.user.id) > -1;
  }

  show() {
    return !this.wiki.private ||
    (this.new() &&
    (this._isOwner() || this._isCollaborator() || this._isAdmin()));
  }

  new() {
    return this.user != null;
  }

  create() {
    return this.new();
  }

  edit() {
    return this.new() &&
      (this.wiki &&
      (this._isOwner() || this._isCollaborator() || this._isAdmin()));
  }

  update() {
    return this.edit();
  }

  delete() {
    return this.update();
  }

}
