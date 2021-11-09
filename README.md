## About the project
This is the solution for the tech challenge presented. The solution was based on a Hash Map that stores all the information for each IP (amount of requests), and also an array that saves (ordered) the top 100 IPs that consume the web-service.

### What would you do differently if you had more time?
I would spend more time creating tests, specifically with bigger iterations and numbers to really check the performance of the code

### What's the runtime complexity of each function
- `request_handle`

  Runtime complexity for `request_handle` is O(n). The reason is that the complexity in this function is where to insert the IP. So we need to take a look at the current top100 array, go through it and search the position to insert. Going through an array is O(n).


- `top100`

  Runtime complexity for top100 is constant time O(n), the reason that I initialize the array with length 100. But doing it so, initializes the array with empty. If we call `top100` before the array is filled, it would return empty values and does doesn't make sense. So, I filter out those empty values.


- `clear`

  The `clear` function runtime complexity is constant time 0(1) as we just clear the variable values and assign new ones.
