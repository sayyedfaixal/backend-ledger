import accountModel from "../models/account.model.js";

/**
 * - POST /api/accounts/
 * - Create a new account for the logged-in user
 * - Protected Route
 */
const createAccountController = async (req, res) => {
  const user = req.user;

  const account = await accountModel.create({
    user: user._id,
  });

  res.status(201).json({
    account,
  });
};

/**
 * - GET /api/accounts/all
 * - Get all accounts across the system
 * - Protected Route (intended for system/admin users)
 */
const getAllAccountsController = async (req, res) => {
  const accounts = await accountModel.find({});
  res.status(200).json({
    accounts,
  });
};


/**
 * - GET /api/accounts/get-all-accounts
 * - Get all accounts belonging to the logged-in user
 * - Protected Route
 */
async function getUserAccountsController(req, res) {

    const accounts = await accountModel.find({ user: req.user._id });

    res.status(200).json({
        accounts
    })    
}

/**
 * - GET /api/accounts/balance/:accountId
 * - Get the balance of a specific account owned by the logged-in user
 * - Protected Route
 */
async function getAccountBalanceController(req, res) {
    const { accountId } = req.params;

    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        })
    }

    const balance = await account.getBalance();

    res.status(200).json({
        accountId: account._id,
        balance: balance
    })
}

/**
 * - GET /api/accounts/:accountId
 * - Get a single account by ID owned by the logged-in user
 * - Protected Route
 */
async function getAccountByIdController(req, res) {
    const { accountId } = req.params;

    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    });

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        });
    }

    res.status(200).json({
        account
    });
}


export { getAllAccountsController, getUserAccountsController, getAccountBalanceController, getAccountByIdController, createAccountController };
