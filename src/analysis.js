const { getTrips, getDriver } = require('api');

/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
async function analysis() {
  // Your code goes here
  const trips = await getTrips()
  // console.log(trips)
  
  let cashCount = 0;
  let nonCashCount = 0;
  let cashAmount = 0;
  let nonCashAmount = 0; 
  let driverTrips = {};
  let driverEarnings = {};
  let driverId = []
  

  for(let element of trips) {
    //get driver id
    if (!driverId.includes(element['driverID'])){
      driverId.push(element.driverID)
    }
    
    if (element['isCash'] === true) {
      cashCount++;
      cashAmount += parseFloat(String(element['billedAmount']).split(',').join(''));
    }
    else{
      nonCashCount++;
      nonCashAmount += parseFloat(String(element['billedAmount']).split(',').join(''));
    }
    //check if the driverID exists in the object. To get most trips by driver
    if(driverTrips[element.driverID]){
      driverTrips[element.driverID]++
    }
    // if key doesnt exist set key value to 1
    else {
      driverTrips[element.driverID] = 1;
    }
    //to get driver earnings
    if(driverEarnings[element.driverID]) {
      driverEarnings[element.driverID] += parseFloat(String(element.billedAmount).split(',').join(''));
    }
    else {
      driverEarnings[element.driverID] = parseFloat(String(element.billedAmount).split(',').join(''));
    }
  }
  // get driversId from the getDriver function and push them into the driverDetails array
  let driverDetails = []
  for (let m of driverId) {
    driverDetails.push(getDriver(m))
  }
  
  let moreThanOneVehicleCount = 0;
  let promiseDriverInfo = await Promise.allSettled(driverDetails);
  
  
  //getting drivers status that are fulfilled
  let correctDriverInfo = [];
  for (let elem of promiseDriverInfo) {
    if(elem['status'] === 'fulfilled') {
      correctDriverInfo.push(elem)
    }
  }
  //to get drivers with more than 1 vehicle
  for (let elem in correctDriverInfo) {
    if((correctDriverInfo[elem].value.vehicleID).length > 1) {
      moreThanOneVehicleCount++;
    }
  }

  // get driver with highest number of trips and their index
  let highestTrips = Object.values(driverTrips);
  let maxTrips = Math.max(...highestTrips);
  let index = highestTrips.indexOf(maxTrips)

  //get driver with highest earnings and their index
  let highestEarned = Object.values(driverEarnings);
  let maxEarned = Math.max(...highestEarned)
  let position = highestEarned.indexOf(maxEarned);
 
  let result = {};
  result['noOfCashTrips'] = cashCount;
  result['noOfNonCashTrips'] = nonCashCount;
  result['billedTotal'] = Number((cashAmount + nonCashAmount).toFixed(2));
  result['cashBilledTotal'] = +(cashAmount.toFixed(2));
  result['nonCashBilledTotal'] = +(nonCashAmount.toFixed(2));
  result['noOfDriversWithMoreThanOneVehicle'] = moreThanOneVehicleCount;
  result['mostTripsByDriver'] = {};
  result['mostTripsByDriver']['name'] = correctDriverInfo[index].value['name'];
  result['mostTripsByDriver']['email'] = correctDriverInfo[index].value['email'];
  result['mostTripsByDriver']['phone'] = correctDriverInfo[index].value['phone'];
  result['mostTripsByDriver']['noOfTrips'] = maxTrips;
  result['mostTripsByDriver']['totalAmountEarned'] = highestEarned[index];
  result['highestEarningDriver'] = {};
  result['highestEarningDriver']['name'] = correctDriverInfo[position].value['name'];
  result['highestEarningDriver']['email'] = correctDriverInfo[position].value['email'];
  result['highestEarningDriver']['phone'] = correctDriverInfo[position].value['phone'];
  result['highestEarningDriver']['noOfTrips'] = highestTrips[position];
  result['highestEarningDriver']['totalAmountEarned'] = maxEarned;
  
  return result;
}
analysis();
module.exports = analysis;
