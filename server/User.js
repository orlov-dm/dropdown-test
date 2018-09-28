
class User {
    constructor({
        id,
        name,
        surname,
        workplace,
        avatarUrl,
        userUrl,
        gender,
    }) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.workplace = workplace;
        this.avatarUrl = avatarUrl;
        this.userUrl = userUrl;
        this.gender = gender;
    }
}

module.exports = User;