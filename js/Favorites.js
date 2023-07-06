import { GithubUser } from "./GithubUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  save() {
    localStorage.setItem("@github-favorites", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username);

      if (userExists) throw new Error("Usuário já cadastrado");

      const user = await GithubUser.search(username);

      if (user.login === undefined) {
        throw new Error("Usuário não encontrado!");
      }

      this.entries = [user, ...this.entries];
      this.update();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    this.entries = this.entries.filter((entry) => user.login !== entry.login);

    this.update();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites")) || [];
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.usersWrapper = this.root.querySelector(".users-body");

    this.update();
    this.onAdd();
  }

  onAdd() {
    const addButton = this.root.querySelector(".search button");

    addButton.onclick = () => {
      const input = this.root.querySelector(".search input");

      this.add(input.value);

      input.value = "";
      input.focus();
    };
  }

  update() {
    this.removeAllRows();

    this.entries.forEach((user) => {
      const row = this.createRow(
        user.login,
        user.name,
        user.public_repos,
        user.followers
      );

      row.querySelector(".remove").onclick = () => {
        const userConfirm = confirm(
          "Tem certeza que deseja deletar essa linha?"
        );

        if (userConfirm) {
          this.delete(user);
        }
      };

      this.usersWrapper.append(row);
    });

    this.save();
  }

  createRow(login, name, public_repos, followers) {
    const row = document.createElement("div");
    row.classList.add("row");
    row.innerHTML = `
    <div class="cell user">
      <img src="https://github.com/${login}.png" alt="" />
      <a href="https://github.com/${login}" target="_blank">
        <p>${name}</p>
        <span>/${login}</span>
      </a>
    </div>
    <div class="cell">${public_repos}</div>
    <div class="cell followers">${followers}</div>
    <div class="cell"><button class="remove">Remover</button></div>
    `;

    return row;
  }

  removeAllRows() {
    this.usersWrapper.querySelectorAll(".row").forEach((row) => {
      row.remove();
    });
  }
}
