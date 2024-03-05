// Bai 1 :
db.aggregation.aggregate([
    {
        $group : {
            _id : "$address.country",
            total : {$sum : 1}
        }
    }
])
// Bai 2:

db.aggregation.aggregate([
    {
      $group: {
        _id: {
          country: "$address.country",
          city: "$address.city",
          postalCode: "$address.postalCode",
          street: "$address.street"
        },
        total: {$sum: 1}
      }
    },
    {
        $sort : {total : -1}
    },
    {
        $limit : 1
    }
  ])
  // Bài 3: 

  db.aggregation.aggregate([
    {
      $match : {
        "payments.name" : "restaurant",
        payments : {
          $elemMatch : {
            name : "restaurant"
          }
        }
      }
    },
    {
      $group : {
        _id : "$address.country",
        visits: {$sum : 1}
      }
    }
])  

// Bài 4:

db.aggregation.aggregate([
  {
    $unwind: "$wealth.bankAccounts"
  },
  {
    $group: {
      _id: {
        firstName: "$firstName",
        lastName: "$lastName"
      },
      totalBalance: { $sum: "$wealth.bankAccounts.balance" }
    }
  },
  {
    $sort: {
      totalBalance: -1
    }
  },
  {
    $limit: 3
  },
 
])

// bài 5
db.aggregation.aggregate([
  {
    $unwind : "$payments"
  },
  {
    $match : {
      "payments.name" : "restaurant"
    }
  },
  {
    $group : {
      _id : "$address.country",
      totalVisits : {$sum : 1},
      totalAmount : {$sum : "$payments.amount"},
      avgAmount : {$avg :  "$payments.amount"}
    }
  }
  

])
// Bài 6:

db.aggregation.aggregate([
  {
    $unwind : "$payments"
  }, 
  {
    $match : {
      "payments.name" : "restaurant"
    }
  },
  {
    $group : {
      _id : "$address.country" ,
      maxVisits : {$max : {$avg : "$payments.amount" }}
    }
  },
  {
    $group : {
      _id : null,
      low : {$min : "$maxVisits"},
      hight : {$max : "$maxVisits"}
    }
  },
  
  {
    $project : {
      _id : 1,
      diff : {$divide : ["$hight" , "$low"]}
    }
  }
])

// Bài 7:

db.aggregation.aggregate([
  {
    $unwind : "$payments"
  },
  {
    $match : {
      "payments.amount" : {$lt : 5 }
    }
  },
  {
    $group : {
      _id : "$_id",
      firstName : {$first : "$firstName"},
      lastName : {$first : "$lastName"},
      payments : {$push: "$payments"},
    }
  }
])

// Bài 8:
db.aggregation.aggregate([
  {
    $unwind : "$payments"
  },
  {
    $match : {
      _id :ObjectId('576865c0bab6cf2f2fb39d7a')
    }
  },
  {
    $group : {
      _id : {
        oid : "$_id",
       category : "$payments.category"
      },
      firstName : {$first : "$firstName"},
      lastName : {$first : "$lastName"},
      total : { $sum : "$payments.amount"}, // lay tong theo tung category va _id
    }
  },
  {
    $group : {
      _id : {
          oid : {
            $convert :{
              input : "$_id.oid",
              to : "string"
            }
          }
      },
      firstName : {$first : "$firstName"},
      lastName : {$first : "$lastName"},
      totalPayments : {$push : {category : "$_id.category", amount : "$total"} }
    }
  }
])

// Bài 9 : 

db.aggregation.aggregate([
  {
    $bucket : {
      groupBy : "$",
      boundaries : [18,29,39,49],
      output : {
        count : {$sum : 1}
      }    
    }
   
  }
])
