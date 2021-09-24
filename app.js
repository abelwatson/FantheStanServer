require('dotenv').config();
const Express = require("express");
const app = Express();
const { sequelize } = require("./db")
const controllers = require("./controllers");

app.use(Express.json());

app.use(require('./middleware/headers'));
app.use("/user", controllers.userController);
app.use("/admin", controllers.adminController);

app.use(require("./middleware/validation"));

app.use("/review", controllers.reviewsController);
app.use("/favorites", controllers.favoritesController);

app.use("/test", (req, res) => {
    res.send('This is a test message')
});

sequelize.authenticate()
    .then(() => sequelize.sync(
        // {force: true}
        ))
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`[Server]: App is listening on ${process.env.PORT}.`);
        });
    })
    .catch((err) => {
        console.log(`[Server]: Server crashed. Error = ${err}`);
    });