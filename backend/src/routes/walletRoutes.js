const router = require("express").Router();
const walletController = require("../controllers/walletController");
const { verifyToken } = require("../middleware/auth");

router.use(verifyToken);

router.post("/", walletController.addWallet);
router.get("/", walletController.getWallets);
router.post("/:id/refresh", walletController.refreshWallet);
// router.delete("/:id", walletController.deleteWallet);

module.exports = router;
