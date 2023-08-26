import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (this.modifiedPaths().includes("password")) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    return user;
  }
  return null;
};

const User = model("User", userSchema);

export default User;
