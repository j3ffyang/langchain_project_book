+++
title = "Ticketing System"
type = "chapter"
weight = 5
+++

Our company undertakes a project to offer operational and support services to one of our banking clients. A key component of this effort is the "Ticketing System," a tool utilized by the operation team to record all customer inquiries. This system encompasses a broad spectrum of issues, ranging from password resets to more complex matters such as operating system restoration and disk failure. Once a problem is identified, it is forwarded to the expert team for resolution. The solution is then documented within the same system, contributing to a vast database of issues and their resolutions. On a daily basis, tens of thousands of problems and their solutions are logged in this ticketing system.

### Business Scenario

To enhance operational efficiency and reduce costs, we've introduced a new service that employs a bot to gather customer queries. This bot then searches for previously resolved issues that match the customer's query. If a similar problem with a solution is found, the solution is provided to the customer. If no matching solution is found, the operation team proceeds with the usual process to address the issue.

### Raw Data in Log

I've compiled a list that includes the ticket number, date of the call, caller information, the application where the issue was reported, the call center agent who responded, details of the solution provided, and the timestamp of the call.

```py
ticket_number,date,caller,application,query,responder,solution,timestamp
000001,2024-04-01,John Doe,Windows Operating System,"I'm having trouble logging into my account. I keep getting an error message saying my password is incorrect, even though I know I'm entering it correctly.",Jane Smith,"Verified the user's account information and reset their password. Provided step-by-step instructions on how to log in with the new password.",2024-04-01 10:15:23
000002,2024-03-30,Jane Doe,Mobile Device,"I placed an order last week but it still hasn't arrived. I need to know the status of my order.",Tom Johnson,"Checked the order status and found that there was a delay in shipping due to a temporary inventory shortage. Provided the customer with an estimated delivery date and offered a discount on their next order as compensation for the delay.",2024-03-30 14:22:45
000003,2024-03-28,Bob Smith,Web Browser,"I can't access my account, and I need to make a payment. Can you help me?",Sarah Lee,"Verified the user's account information and unlocked their access. Walked them through the steps to make the payment online.",2024-03-28 09:37:12
...
```

The example data provided above is generated by utilizing the following `prompt` at Phind.com:

> emulate the call-center's log system. create a csv file, for 10 lines, that contains the following column. in query and solution columns, please give more comprehensive information. the ticket_number is a 6 digits sequential number. the application is a list of various applications, such as windows operating system, mobile device, etc<br>
ticket_number | date | caller | application | query | responder | solution | timestamp
-- | -- | -- | -- | -- | -- | -- | --