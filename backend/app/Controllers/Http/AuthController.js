"use strict";

const User = use("App/Models/User");
class AuthController {
  async register({ request }) {
    const data = request.only(["username", "password"]);

    if (
      !data.password.match(
        /^(?=.*[0-9])(?=.{6,20}$)(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
      )
    ) {
      throw new Error(
        "Password must be greater than 6 characters and contain at least a number"
      );
    } else if (
      !data.username.match(
        /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
      )
    ) {
      throw new Error(
        "Username must be greater than 5 characters and  can't contain symbols"
      );
    } else if (await User.findBy("username", data.username)) {
      throw new Error("Username already in use");
    }

    const user = await User.create(data);

    return user;
  }

  async login({ request, auth }) {
    const { username, password } = request.all();

    const token = auth.attempt(username, password);

    return token;
  }
}

module.exports = AuthController;
