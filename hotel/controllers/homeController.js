const hello = (req, res) => {
    res.render("home/home");
};

const dostupnost = (req, res) => {
    res.send("Dostupnost");
};

const cijene = (req, res) => {
    res.send("Cijene");
};

module.exports = {hello, dostupnost, cijene};
