'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Post = mongoose.model('Post'),
	User = mongoose.model('User'),
	Asset = mongoose.model('Asset'),
	_ = require('lodash'),
	aws = require('aws-sdk'),
	async = require('async');

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;


exports.retrieveUserList = function(req, res){
	User.find({}, function(err, users){
		 res.json(users);
	});
};

exports.updateUser = function(req, res){
	var nUser = JSON.parse(req.body.userRecord);
	User.findOneAndUpdate({'email': req.body.userEmail}, {$set : nUser}, function(err, user){
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}else{
			res.json(user);			
		}

	});
};

exports.deleteUser = function(req, res){
	console.log(req.body.userRecord);
	// User.find({'email': req.body.userEmail}).remove().exec();
	User.remove({'email': req.body.userEmail}, function(err){
		if(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}else{
			User.find({}, function(err, users){
				res.json(users);
			});
		}
	});
};

exports.createUser = function(req, res){
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;
	console.log('create user function server');
	// Init Variables
	var user = new User(req.body);
	var message = null;

	// Add missing user fields
	user.provider = 'local';
	//user.displayName = user.firstName + ' ' + user.lastName;
	user.displayName = user.email;
	user.username = user.email;

	// Then save the user
	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;
			User.find({}, function(err, users){
				 res.json(users);
			});
		}
	});	
};

exports.signaws = function(req, res){
	console.log(req.body.assetName);
    aws.config.update({accessKeyId: AWS_ACCESS_KEY , secretAccessKey: AWS_SECRET_KEY });
    aws.config.update({region: 'ap-southeast-1' , signatureVersion: 'v4' });
    var s3 = new aws.S3(); 
    var s3_params = { 
        Bucket: S3_BUCKET, 
        Key: 'assets/' + req.body.assetName, 
        Expires: 60, 
        ContentType: req.body.assetType, 
        ACL: 'public-read'
    }; 
    s3.getSignedUrl('putObject', s3_params, function(err, data){ 
        if(err){ 
            console.log(err); 
        }
        else{ 
        	console.log(data);
            var return_data = {
                signed_request: data,
                url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/assets/'+req.body.assetName
            };
            res.write(JSON.stringify(return_data));
            res.end();
        } 
    });
};

exports.addNewAsset = function(req, res){
	var asset = new Asset(req.body);
	var message = null;
	// Then save the user
	asset.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login

			Asset.find({}, function(err, assets){
				 res.json(assets);
			});
		}
	});	
};

exports.retrieveAssets = function(req, res){
	Asset.find({}, function(err, assets){
		 res.json(assets);
	});
};

exports.updateAsset = function(req, res){
	
	var nAsset = req.body.assetRecord;
	console.log(nAsset);
	Asset.findOneAndUpdate({'name': req.body.assetName}, {$set : nAsset}, function(err, asset){
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}else{
			res.json(asset);			
		}

	});
};

exports.deleteAsset = function(req, res){
	// User.find({'email': req.body.userEmail}).remove().exec();
	Asset.remove({'name': req.body.assetName}, function(err){
		if(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}else{
			Asset.find({}, function(err, assets){
				res.json(assets);
			});
		}
	});
};

exports.retrieveCurrentAd = function(req, res){
	Asset.find({'display': true}, function(err, assets){
		var randPos = _.random(0, assets.length-1);
		res.json(assets[randPos]);

	});
};

exports.retrieveStatisticsCreditProfile = function(req, res){
	var totalUsers = 0;
	var numCompletedCreditProfile = 0;
	var numIncompleteCreditProfile = 0;
	var ageArr = [0,0,0,0,0];
	var educationLevelArr = [0,0,0,0,0,0];
	var currentEmploymentArr = [0,0,0,0];
	var housingOwnedArr = [0,0,0,0,0,0];
	var avgIncomeArr = [0,0,0,0,0,0,0];
	var avgExpenseArr = [0,0,0,0,0,0,0];
	var avgSavingsArr = [0,0,0,0,0,0,0];
	var creditHistoryArr = [0,0,0,0];
	var bankruptStatusArr = [0,0];
	var numCreditCardArr = [0,0,0,0,0];

	User.find({}, function(err, users){
		totalUsers = users.length;
		users.forEach(function(user){
			if(user.completeQns === false){
				numIncompleteCreditProfile++;
			}else{
				numCompletedCreditProfile++;
			}
			if(user.creditProfileScore){
				//Basic Demographics
				if(user.creditProfileScore.sAge === '4'){
					ageArr[0]++;
				}else if(user.creditProfileScore.sAge === '3'){
					ageArr[1]++;
				}else if(user.creditProfileScore.sAge === '2'){
					ageArr[2]++;
				}else if(user.creditProfileScore.sAge === '1'){
					ageArr[3]++;
				}else if(user.creditProfileScore.sAge === '0'){
					ageArr[4]++;
				}	

				if(user.creditProfileScore.sEducationLevel === '5'){
					educationLevelArr[0]++;
				}else if(user.creditProfileScore.sEducationLevel === '4'){
					educationLevelArr[1]++;
				}else if(user.creditProfileScore.sEducationLevel === '3'){
					educationLevelArr[2]++;
				}else if(user.creditProfileScore.sEducationLevel === '2'){
					educationLevelArr[3]++;
				}else if(user.creditProfileScore.sEducationLevel === '1'){
					educationLevelArr[4]++;
				}else if(user.creditProfileScore.sEducationLevel === '0'){
					educationLevelArr[5]++;
				}	

				if(user.creditProfileScore.sCurrentOccupation === '3'){
					currentEmploymentArr[0]++;
				}else if(user.creditProfileScore.sCurrentOccupation === '2'){
					currentEmploymentArr[1]++;
				}else if(user.creditProfileScore.sCurrentOccupation === '1'){
					currentEmploymentArr[2]++;
				}else if(user.creditProfileScore.sCurrentOccupation === '0'){
					currentEmploymentArr[3]++;
				}

				if(user.creditProfileScore.sLocativeType === '5'){
					housingOwnedArr[0]++;
				}else if(user.creditProfileScore.sLocativeType === '4'){
					housingOwnedArr[1]++;
				}else if(user.creditProfileScore.sLocativeType === '3'){
					housingOwnedArr[2]++;
				}else if(user.creditProfileScore.sLocativeType === '2'){
					housingOwnedArr[3]++;
				}else if(user.creditProfileScore.sLocativeType === '1'){
					housingOwnedArr[4]++;
				}else if(user.creditProfileScore.sLocativeType === '0'){
					housingOwnedArr[5]++;
				}

				//Financial demographics
				if(user.creditProfileScore.sMonthlyIncome === '6'){
					avgIncomeArr[0]++;
				}else if(user.creditProfileScore.sMonthlyIncome === '5'){
					avgIncomeArr[1]++;
				}else if(user.creditProfileScore.sMonthlyIncome === '4'){
					avgIncomeArr[1]++;
				}else if(user.creditProfileScore.sMonthlyIncome === '3'){
					avgIncomeArr[2]++;
				}else if(user.creditProfileScore.sMonthlyIncome === '2'){
					avgIncomeArr[3]++;
				}else if(user.creditProfileScore.sMonthlyIncome === '1'){
					avgIncomeArr[4]++;
				}else if(user.creditProfileScore.sMonthlyIncome === '0'){
					avgIncomeArr[5]++;
				}

				if(user.creditProfileScore.sMonthlyExpense === '6'){
					avgExpenseArr[0]++;
				}else if(user.creditProfileScore.sMonthlyExpense === '5'){
					avgExpenseArr[1]++;
				}else if(user.creditProfileScore.sMonthlyExpense === '4'){
					avgExpenseArr[1]++;
				}else if(user.creditProfileScore.sMonthlyExpense === '3'){
					avgExpenseArr[2]++;
				}else if(user.creditProfileScore.sMonthlyExpense === '2'){
					avgExpenseArr[3]++;
				}else if(user.creditProfileScore.sMonthlyExpense === '1'){
					avgExpenseArr[4]++;
				}else if(user.creditProfileScore.sMonthlyExpense === '0'){
					avgExpenseArr[5]++;
				}

				if(user.creditProfileScore.sMonthlySavings === '6'){
					avgSavingsArr[0]++;
				}else if(user.creditProfileScore.sMonthlySavings === '5'){
					avgSavingsArr[1]++;
				}else if(user.creditProfileScore.sMonthlySavings === '4'){
					avgSavingsArr[1]++;
				}else if(user.creditProfileScore.sMonthlySavings === '3'){
					avgSavingsArr[2]++;
				}else if(user.creditProfileScore.sMonthlySavings === '2'){
					avgSavingsArr[3]++;
				}else if(user.creditProfileScore.sMonthlySavings === '1'){
					avgSavingsArr[4]++;
				}else if(user.creditProfileScore.sMonthlySavings === '0'){
					avgSavingsArr[5]++;
				}

				if(user.creditProfileScore.sCreditHistory === '1'){
					creditHistoryArr[0]++;
				}else if(user.creditProfileScore.sCreditHistory === '2'){
					creditHistoryArr[1]++;
				}else if(user.creditProfileScore.sCreditHistory === '3'){
					creditHistoryArr[2]++;
				}else if(user.creditProfileScore.sCreditHistory === '4'){
					creditHistoryArr[3]++;
				}

				if(user.creditProfileScore.sBankruptStatus === '0'){
					bankruptStatusArr[0]++;
				}else if(user.creditProfileScore.sBankruptStatus === '4'){
					bankruptStatusArr[1]++;
				}

				if(user.creditProfileScore.sNumberOfCreditCards === '4'){
					numCreditCardArr[0]++;
				}else if(user.creditProfileScore.sNumberOfCreditCards === '3'){
					numCreditCardArr[1]++;
				}else if(user.creditProfileScore.sNumberOfCreditCards === '2'){
					numCreditCardArr[2]++;
				}else if(user.creditProfileScore.sNumberOfCreditCards === '1'){
					numCreditCardArr[3]++;
				}else if(user.creditProfileScore.sNumberOfCreditCards === '0'){
					numCreditCardArr[4]++;
				}
			}

		});
		var statisticsCreditProfile = {
			totalUsers: totalUsers,
			numCompletedCreditProfile: numCompletedCreditProfile,
			numIncompleteCreditProfile: numIncompleteCreditProfile,
			ageArr: ageArr,
			educationLevelArr: educationLevelArr,
			currentEmploymentArr: currentEmploymentArr,
			housingOwnedArr: housingOwnedArr,
			avgIncomeArr: avgIncomeArr,
			avgExpenseArr: avgExpenseArr,
			avgSavingsArr: avgSavingsArr,
			creditHistoryArr: creditHistoryArr,
			bankruptStatusArr: bankruptStatusArr,
			numCreditCardArr: numCreditCardArr
		};
		res.json(statisticsCreditProfile);
	});
};


exports.retrieveFinancialUsage = function(req, res){
	var selectedMonthArr = req.body.selectedMonthArr;
	var assetsArr = new Array(req.body.numMonths);
	for(var i = 0; i < req.body.numMonths; i++){
		assetsArr[i] = 0;
	}
	var liabilitiesArr = new Array(req.body.numMonths);
	for(var j = 0; j < req.body.numMonths; j++){
		liabilitiesArr[j] = 0;
	}	
	var incomeExpenseArr = new Array(req.body.numMonths);
	for(var k = 0; k < req.body.numMonths; k++){
		incomeExpenseArr[k] = 0;
	}		
	User.find({}, function(err, users){
		async.series([
			function(callback){
				users.forEach(function(user){
					if(user.assetsRecords){
						user.assetsRecords.forEach(function(aRecord){
							for(var a = 0; a < selectedMonthArr.length; a++){
								if(aRecord.month === selectedMonthArr[a][0] && aRecord.year === selectedMonthArr[a][1]){
									assetsArr[a]++;
								}
							}
						});
					}
					if(user.liabilitiesRecords){
						user.liabilitiesRecords.forEach(function(lRecord){
							for(var a = 0; a < selectedMonthArr.length; a++){
								if(lRecord.month === selectedMonthArr[a][0] && lRecord.year === selectedMonthArr[a][1]){
									liabilitiesArr[a]++;
								}
							}
						});
					}
					if(user.incomeExpenseRecords){
						user.incomeExpenseRecords.forEach(function(ieRecord){
							for(var a = 0; a < selectedMonthArr.length; a++){
								if(ieRecord.month === selectedMonthArr[a][0] && ieRecord.year === selectedMonthArr[a][1]){
									incomeExpenseArr[a]++;
								}
							}
						});
					}

					
			});
			callback();		
		}
		], function(err){
			console.log('here');
			if(err) console.log('Problem iterating user array');

			var statisticsFinancialUsage = {
				assetsArr: assetsArr,
				liabilitiesArr: liabilitiesArr,
				incomeExpenseArr: incomeExpenseArr
			};
			res.json(statisticsFinancialUsage);
		});
		
	});
};

exports.retrieveSocialActivity = function(req, res){
	var selectedMonthArr = req.body.selectedMonthArr;
	var postsArr = new Array(req.body.numMonths);
	for(var i = 0; i < req.body.numMonths; i++){
		postsArr[i] = 0;
	}
	var commentsArr = new Array(req.body.numMonths);
	for(var j = 0; j < req.body.numMonths; j++){
		commentsArr[j] = 0;
	}	

	Post.find({}, function(err, posts){
		posts.forEach(function(post){
			for(var a = 0; a < selectedMonthArr.length; a++){
				if(post.created.getMonth() === selectedMonthArr[a][0] && post.created.getFullYear() === selectedMonthArr[a][1]){
					postsArr[a]++;
				}
			}
			if(post.comments){
				post.comments.forEach(function(comments){
					for(var a = 0; a < selectedMonthArr.length; a++){
						if(comments.created.getMonth() === selectedMonthArr[a][0] && comments.created.getFullYear() === selectedMonthArr[a][1]){
							commentsArr[a]++;
						}
					}					
				});
			}
		});


		var statisticsSocialActivity = {
			postsArr: postsArr,
			commentsArr: commentsArr
		};

		res.json(statisticsSocialActivity);
	});
};

exports.retrieveMilestones = function(req, res){
	var milestonesArr = [0,0];
	User.find({}, function(err, users){
		users.forEach(function(user){
			if(user.mileStones.length !== 0){
				user.mileStones.forEach(function(milestone){
					milestonesArr[0]++;
				});
				
			}
			if(user.completedMilestones.length !== 0){
				user.completedMilestones.forEach(function(mileStones){
					milestonesArr[0]++;
					milestonesArr[1]++;
				});

			}
		});


		var statisticsMilestones = {
			milestonesArr: milestonesArr
		};

		res.json(statisticsMilestones);
	});
};

exports.retrieveFinancialHealth = function(req, res){
	console.log(req.body);
	var currentLiquidityArr = [0,0,0]; //1
	var totalLiquidityArr = [0,0,0]; //2
	var surplusIncomeArr = [0,0,0]; //3
	var basicSavingArr = [0,0,0]; //4
	var essentialExpensesArr = [0,0,0]; //5
	var lifestyleExpensesArr = [0,0,0]; //6 
	var totalDebtArr = [0,0,0]; //7
	var currentDebtArr = [0,0,0]; //8
	var propertyDebtArr = [0,0,0]; //9
	var monthlyDebtServiceArr = [0,0,0]; //10
	var monthlyCreditCardArr = [0,0,0]; //11
	var netWorthBenchmarkArr = [0,0,0]; //12
	var solvencyArr = [0,0,0]; //13
	var currentAssetDebtArr = [0,0,0]; //14
	var investmentAssetsArr = [0,0,0]; //15


	User.find({}, function(err, users){

		users.forEach(function(user){
			//retrieve all records
			var selectedAssetRecord = [];
			var selectedLiabilitiesRecord = [];
			var selectedIncomeExpenseRecord = [];
			if(user.assetsRecords){
				user.assetsRecords.forEach(function(aRecord){
					if(aRecord.month === req.body.month && aRecord.year === req.body.year){
						selectedAssetRecord = aRecord;
					}
				});
			}
			if(user.liabilitiesRecords){
				user.liabilitiesRecords.forEach(function(lRecord){
					if(lRecord.month === req.body.month && lRecord.year === req.body.year){
						selectedLiabilitiesRecord = lRecord;
					}
				});
			}
			if(user.incomeExpenseRecords){
				user.incomeExpenseRecords.forEach(function(ieRecord){
					if(ieRecord.month === req.body.month && ieRecord.year === req.body.year){
						selectedIncomeExpenseRecord = ieRecord;
					}
				});
			}
			//calculate ratios
            //1) Liquidity Ratio
            //Current Liquidity - 1
            var ratioLiquidity = selectedAssetRecord.cashEquivalentsAmt / selectedIncomeExpenseRecord.monthlyExpenseAmt;
            //Total Liquidity - 2
            var ratioTotalLiquidity = (Number(selectedAssetRecord.cashEquivalentsAmt) + Number(selectedAssetRecord.investedAssetsAmt)) / selectedIncomeExpenseRecord.monthlyExpenseAmt;

            //2) Savings
            //Surplus Income Ratio /Savings Ratio //To review -- net gross/ monthly gross income - 3
            var ratioSaving = selectedIncomeExpenseRecord.netCashFlow / selectedIncomeExpenseRecord.monthlyIncomeAmt;
            //Basic Saving Ratio - 4
            var ratioBasicSaving = selectedIncomeExpenseRecord.optionalSavingsAmt / selectedIncomeExpenseRecord.monthlyIncomeAmt;

            //3) Expenses Ratio
            //Essential Expenses to Income Ratio - 5
            var ratioEssentialExpenses;
            var publicTransportValue;
            try{
                publicTransportValue = selectedIncomeExpenseRecord.monthlyExpense.transport.publicTransport.value;
            }catch(e){
                publicTransportValue = 0;
            }
            var maidValue;

            try{
                maidValue = selectedIncomeExpenseRecord.monthlyExpense.fixedExpense.maid.value;
            }catch(e){
                maidValue = 0;
            }            

            ratioEssentialExpenses = (Number(selectedIncomeExpenseRecord.fixedExpenseAmt) + Number(publicTransportValue) + Number(selectedIncomeExpenseRecord.utilityHouseholdAmt) + Number(selectedIncomeExpenseRecord.foodNecessitiesAmt) - Number(maidValue))/ selectedIncomeExpenseRecord.monthlyIncomeAmt;

            //Lifestyle Expenses to Income Ratio - 6
            var ratioLifestyleExpenses;

            ratioLifestyleExpenses = (Number(maidValue) + Number(selectedIncomeExpenseRecord.transportAmt) - Number(publicTransportValue) + Number(selectedIncomeExpenseRecord.miscAmt)) / selectedIncomeExpenseRecord.monthlyIncomeAmt;

            //4 Debt Ratio
            //Assets to Debt Ratio - 7 
            var ratioAssetDebt = selectedLiabilitiesRecord.totalAmt / selectedAssetRecord.totalAmt;
            //Debt Service Ratio - 8
            var ratioDebtService = selectedLiabilitiesRecord.totalAmt / selectedIncomeExpenseRecord.monthlyIncomeAmt;
            //Housing Expense Ratio - 9 
            var ratioHouseExpense = (selectedIncomeExpenseRecord.monthlyExpenseAmt - selectedIncomeExpenseRecord.fixedExpenseAmt) / selectedIncomeExpenseRecord.monthlyIncomeAmt; 
            //Debt Income Ratio - 10
            var ratioDebtIncome;
            var mortgageRepaymentsValue;
            var rentalRepaymentsValue;
            var carLoanRepaymentValue;
            var otherLoanRepaymentsValue;

            try {
                mortgageRepaymentsValue = selectedIncomeExpenseRecord.monthlyExpense.fixedExpense.mortgageRepayments.value;
            }catch (e){
                mortgageRepaymentsValue = 0;
            }
            try{
                rentalRepaymentsValue = selectedIncomeExpenseRecord.monthlyExpense.fixedExpense.rentalRepaymentsValue.value;
            }catch(e){
                rentalRepaymentsValue = 0;
            }
            try{
                carLoanRepaymentValue = selectedIncomeExpenseRecord.monthlyExpense.transport.carLoanRepayment.value;
            }catch (e) {
                carLoanRepaymentValue = 0;
            }
            try{
                otherLoanRepaymentsValue = selectedIncomeExpenseRecord.monthlyExpense.fixedExpense.otherLoanRepayments.value;
            }catch(e){
                otherLoanRepaymentsValue = 0;
            }

            ratioDebtIncome = (Number(mortgageRepaymentsValue) + Number(rentalRepaymentsValue) + Number(carLoanRepaymentValue) + Number(otherLoanRepaymentsValue)) / selectedIncomeExpenseRecord.monthlyIncomeAmt;
            
            //Consumer Debt Ratio - 11
            var ratioConsumerDebt = selectedLiabilitiesRecord.shortTermCreditAmt / selectedIncomeExpenseRecord.monthlyIncomeAmt;

            //5 Net Worth 
            //Net WorthBenchmark Ratio - 12
            var netWorthBenchmark;
          	if(isNaN(user.age)){
          		netWorthBenchmark = 'N/A';
          		
          	}else{
          		netWorthBenchmark = (Number(user.age) * Number(selectedIncomeExpenseRecord.monthlyIncomeAmt))/ 10;
          	}
            
            var ratioNetWorthBenchmark = (Number(selectedAssetRecord.totalAmt) - Number(selectedLiabilitiesRecord.totalAmt)) / netWorthBenchmark;
            
            //Solvency Ratio - 13
            var ratioSolvency = (selectedAssetRecord.totalAmt - selectedLiabilitiesRecord.totalAmt) / selectedAssetRecord.totalAmt;

            //6 Asset vs Debt
            //Current Asset to Debt Ratio - 14
            var ratioCurrentAssetDebt = selectedAssetRecord.cashEquivalentsAmt / selectedLiabilitiesRecord.shortTermCreditAmt;

            //Investment Ratio - 15
            var ratioInvestment;
            var privatePropertiesValue;
            try{
                privatePropertiesValue = selectedAssetRecord.investedAssets.privateProperties.value;
            }catch(e){
                privatePropertiesValue = 0;
            }      
            ratioInvestment = (Number(selectedAssetRecord.cashEquivalentsAmt) + Number(selectedAssetRecord.investedAssetsAmt) - Number(privatePropertiesValue)) / selectedAssetRecord.totalAmt;    

			//analyze
            //Assign Ratio to Scope
            //1) Liquidity Ratio
            //Current Liquidity 
            if(isFinite(ratioLiquidity)) {
                ratioLiquidity = ratioLiquidity.toFixed(2);
                if(ratioLiquidity < 2){
                	currentLiquidityArr[1]++;
                }else{
                	currentLiquidityArr[0]++;
                }
            }else {
                ratioLiquidity = 'N/A';
                currentLiquidityArr[2]++;
            }
            //Total Liquidity 
            if(isFinite(ratioTotalLiquidity)){
                ratioTotalLiquidity = ratioTotalLiquidity.toFixed(2);
                if(ratioTotalLiquidity< 0.1){
                	totalLiquidityArr[1]++;
                }else{
                	totalLiquidityArr[0]++;
                }
            }else{
                ratioTotalLiquidity = 'N/A';
                totalLiquidityArr[2]++;
            }

            //2) Savings
            //Surplus Income Ratio /Savings Ratio
            if(isFinite(ratioSaving)) {
                ratioSaving = ratioSaving.toFixed(2);
                if(ratioSaving < 0.12){
                	surplusIncomeArr[1]++;
                }else{
                	surplusIncomeArr[0]++;
                }
            }else{
                ratioSaving = 'N/A';
                surplusIncomeArr[2]++;
            }
            //Basic Saving Ratio 
            if(isFinite(ratioBasicSaving)){
                ratioBasicSaving = ratioBasicSaving.toFixed(2);
                if(ratioBasicSaving < 0.1){
                	basicSavingArr[1]++;
                }else{
                	basicSavingArr[0]++;
                }
            }else{
                ratioBasicSaving = 'N/A';
                basicSavingArr[2]++;
            }

            //3) Expenses Ratio
            //Essential Expenses to Income Ratio
            if(isFinite(ratioEssentialExpenses)){
                ratioEssentialExpenses = ratioEssentialExpenses.toFixed(2);
                if(ratioEssentialExpenses >=0.5){
                	essentialExpensesArr[1]++;
                }else{
                	essentialExpensesArr[0]++;
                }
            }else{
                ratioEssentialExpenses = 'N/A';
                essentialExpensesArr[2]++;
            }
            //Lifestyle Expenses to Income Ratio
            if(isFinite(ratioLifestyleExpenses)){
                ratioLifestyleExpenses = ratioLifestyleExpenses.toFixed(2);
                if(ratioLifestyleExpenses >=0.3){
                	lifestyleExpensesArr[1]++;
                }else{
                	lifestyleExpensesArr[0]++;
                }
            }else{
                ratioLifestyleExpenses = 'N/A';
                lifestyleExpensesArr[2]++;
            }


            //4) Debt Ratio
            //Assets to Debt Ratio
            if(isFinite(ratioAssetDebt)) {
                ratioAssetDebt = ratioAssetDebt.toFixed(2);
                if(ratioAssetDebt >=0.6){
                	totalDebtArr[1]++;
                }else{
                	totalDebtArr[0]++;
                }
            }else {
                ratioAssetDebt = 'N/A';
                totalDebtArr[2]++;
            }
            //Debt Service Ratio
            if(isFinite(ratioDebtService)) {
                ratioDebtService = ratioDebtService.toFixed(2);
                if(ratioDebtService > 0.36){
                	currentDebtArr[1]++;
                }else{
                	currentDebtArr[0]++;
                }
            }else {
                ratioDebtService ='N/A';
                currentDebtArr[2]++;
            }
            //Housing Expense Ratio
            if(isFinite(ratioHouseExpense)) {
                ratioHouseExpense = ratioHouseExpense.toFixed(2);
                if(ratioHouseExpense >0.35){
                	propertyDebtArr[1]++;
                }else{
                	propertyDebtArr[0]++;
                }
            } else {
                ratioHouseExpense = 'N/A';
                propertyDebtArr[2]++;
            }
            //Debt Income Ratio
            if(isFinite(ratioDebtIncome)) {
                ratioDebtIncome = ratioDebtIncome.toFixed(2);
                if(ratioDebtIncome > 0.4){
                	monthlyDebtServiceArr[1]++;
                }else{
                	monthlyDebtServiceArr[0]++;
                }
            }else{
                ratioDebtIncome = 'N/A';
                monthlyDebtServiceArr[2]++;
            }
            //Consumer Debt Ratio
            if(isFinite(ratioConsumerDebt)) {
                ratioConsumerDebt = ratioConsumerDebt.toFixed(2);
                if(ratioConsumerDebt > 0.1){
                	monthlyCreditCardArr[1]++;
                }else{
                	monthlyCreditCardArr[0]++;
                }
            }else{
                ratioConsumerDebt = 'N/A';
                monthlyCreditCardArr[2]++;
            }
            //5 Net Worth 
            //Net WorthBenchmark Ratio
            if(isNaN(ratioNetWorthBenchmark)){
            	ratioNetWorthBenchmark = 'N/A';
                netWorthBenchmarkArr[2]++;
            }else if(isFinite(ratioNetWorthBenchmark)) {
                ratioNetWorthBenchmark = ratioNetWorthBenchmark.toFixed(2);
                if(ratioNetWorthBenchmark <=0.75){
                	netWorthBenchmarkArr[1]++;
                }else{
                	netWorthBenchmarkArr[0]++;
                }
            } else {
                ratioNetWorthBenchmark = 'N/A';
                netWorthBenchmarkArr[2]++;
            }
            //Solvency Ratio
            if(isFinite(ratioSolvency)) {
                ratioSolvency = ratioSolvency.toFixed(2);
                if(ratioSolvency <=0.2){
                	solvencyArr[1]++;
                }else{
                	solvencyArr[0]++;
                }
            }else{
                ratioSolvency = 'N/A';
                solvencyArr[2]++;
            }

            //6 Asset vs Debt
            //Current Asset to Debt Ratio
            if(isFinite(ratioCurrentAssetDebt)){
                ratioCurrentAssetDebt = ratioCurrentAssetDebt.toFixed(2);
                if(ratioCurrentAssetDebt <=0.2){
                	currentAssetDebtArr[1]++;
                }else{
                	currentAssetDebtArr[0]++;
                }
            }else{
                ratioCurrentAssetDebt = 'N/A';
                currentAssetDebtArr[2]++;
            }
            //Investment Ratio
            if(isFinite(ratioInvestment)) {
                ratioInvestment = ratioInvestment.toFixed(2);
                if(ratioInvestment <=0.2){
                	investmentAssetsArr[1]++;
                }else{
                	investmentAssetsArr[0]++;
                }
            }else{
               	ratioInvestment = 'N/A';
               	investmentAssetsArr[2]++;
            }


			//return result
		});

		var statisticsFinancialHealth = {
			currentLiquidityArr: currentLiquidityArr,
			totalLiquidityArr: totalLiquidityArr,
			surplusIncomeArr: surplusIncomeArr,
			basicSavingArr: basicSavingArr,
			essentialExpensesArr: essentialExpensesArr,
			lifestyleExpensesArr: lifestyleExpensesArr,
			totalDebtArr: totalDebtArr,
			currentDebtArr: currentDebtArr,
			propertyDebtArr: propertyDebtArr,
			monthlyDebtServiceArr: monthlyDebtServiceArr,
			monthlyCreditCardArr: monthlyCreditCardArr,
			netWorthBenchmarkArr: netWorthBenchmarkArr,
			solvencyArr: solvencyArr,
			currentAssetDebtArr: currentAssetDebtArr,
			investmentAssetsArr: investmentAssetsArr
		};

		res.json(statisticsFinancialHealth);
	});
};