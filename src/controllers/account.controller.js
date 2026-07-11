import accountModel from "../models/account.model.js";

const createAccountController = async (req, res) => {
  const user = req.user;

  const account = await accountModel.create({
    user: user._id,
  });

  res.status(201).json({
    account,
  });
};

const getAllAccountsController = async (req, res) => {
  const accounts = await accountModel.find({});
  res.status(200).json({
    accounts,
  });
};


async function getUserAccountsController(req, res) {

    const accounts = await accountModel.find({ user: req.user._id });

    res.status(200).json({
        accounts
    })    
}

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
