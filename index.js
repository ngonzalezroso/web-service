import CONFIG from './config'
// will store all IPs (as keys) and the amount of request for each IP (value)
let IP_HASH = {};
// this array it is ordered from greatest to least amount of requests
let TOP_100 = new Array(CONFIG.TOP_ARRAY_LENGTH);
let lastPositionInserted = -1;

/**
 * Will return the position in the array (TOP_100) where IP should be inserted
 * @param {String} ip - ip that we want to insert on the array
 * @param {Number} positionInArray - position of the element on TOP_100 array
 * @return {Number} position in the array where to insert
 */
function getPositionToInsert(ip, positionInArray) {
  const amount = IP_HASH[ip];
  // using this variable to move across the array.
  // Using positionInArray -1 (if the element is already in the array, so we can start comparing with the next element)
  // or lastPositionInserted;
  let index = positionInArray !== -1 ? positionInArray - 1 : lastPositionInserted;
  let ipToCompare = TOP_100[index];
  let amountToCompare = IP_HASH[ipToCompare];

  // we want to move to the left ONLY if the amount is bigger (strict) than the other amount
  while (index >= 0 && amount > amountToCompare) {
    index -= 1;
    ipToCompare = TOP_100[index];
    amountToCompare = IP_HASH[ipToCompare];
  }

  return index + 1; // insert next to first element that has more requests
}

/**
 * Inserts the ip (if needed) on the ordered array
 * @param {String} ip - the IP to insert
 */
function insertOrdered(ip) {
  const index = TOP_100.indexOf(ip);
  const isAlreadyInArray = index !== -1;
  const amount = IP_HASH[ip];

  // the array isn't filled yet
  if (lastPositionInserted < (CONFIG.TOP_ARRAY_LENGTH - 1) && !isAlreadyInArray) {
    // just insert at the end, if the number of request was bigger than the last IP, it should be already in the array
    lastPositionInserted += 1;
    TOP_100[lastPositionInserted] = ip;
    return;
  }

  const positionToInsert = getPositionToInsert(ip, index);

  if (isAlreadyInArray) {
    // the amount of request isn't bigger than the first element on the left
    if (positionToInsert === index) return;

    // need to shift all elements from array
    // divide the array into 2 where the elements needs to be inserted, from the second half we need to remove the element
    const firstHalf = TOP_100.slice(0, positionToInsert);
    let secondHalf = TOP_100.slice(positionToInsert);
    const newIndex = secondHalf.indexOf(ip);
    secondHalf.splice(newIndex, 1); // remove element
    TOP_100 = firstHalf.concat(ip, secondHalf);
  } else {
    const currentElementInPositionToInsert = IP_HASH[TOP_100[positionToInsert]];
    if (positionToInsert === CONFIG.TOP_ARRAY_LENGTH || currentElementInPositionToInsert >= amount) {
      // the last N elements have the same amount of requests as IP and the array is full. So we don't insert it
      // if the array wasn't full, the IP would be inserted on the previous check
      return;
    }
    // need to insert between elements
    const firstHalf = TOP_100.slice(0, positionToInsert);
    const secondHalf = TOP_100.slice(positionToInsert);
    TOP_100 = firstHalf.concat(ip, secondHalf);
    // if the array was already full, we just increased the length into 101
    if (TOP_100.length > CONFIG.TOP_ARRAY_LENGTH) {
      // need to remove the last element
      TOP_100.splice(-1);
    }
  }
}

export function top100() {
  // just in case there's int CONFIG.TOP_ARRAY_LENGTH different IPs
  return TOP_100.filter(Boolean);
}

export function clear() {
  TOP_100 = new Array(CONFIG.TOP_ARRAY_LENGTH);
  IP_HASH = {};
  lastPositionInserted = -1;
}

export function request_handled(ip_address) {
  const requestAmount = (IP_HASH[ip_address] ?? 0) + 1;
  IP_HASH[ip_address] = requestAmount;
  insertOrdered(ip_address);
}
