const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");
const { sendVerificationEmail } = require("../utils/mailer");
const jwt = require("../utils/jwt");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        // Nếu chưa có user thì tạo mới ở trạng thái verifying
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            username: profile.displayName,
            status: "verifying",
            roles: ["user"],
          });

          // Gửi email xác thực
          const token = await jwt.generateToken(
            { email: user.email },
            process.env.ACCESS_TOKEN,
            "1d"
          );

          await sendVerificationEmail(user.email, token);
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Không cần serializeUser nếu dùng JWT, nhưng có thể giữ lại nếu bạn dùng session ở nơi khác
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
