'use strict';

describe('deep insert', function () {
  let db;

  before(function () {
    return resetDb('data-products-orders').then(instance => db = instance);
  });

  after(function () {
    return db.instance.$pool.end();
  });

  it('inserts a product and an order in one go', function* () {
    const res = yield db.products.insert({
      name: 'something',
      orders: [{
        product_id: undefined,
        user_id: 5,
        notes: 'deep insert test'
      }]
    });

    assert.equal(res.name, 'something');

    const orders = yield db.orders.find({product_id: res.id});

    assert.lengthOf(orders, 1);
    assert.equal(orders[0].user_id, 5);
    assert.equal(orders[0].notes, 'deep insert test');
  });

  it('inserts a product and multiple orders in one go', function* () {
    const res = yield db.products.insert({
      name: 'something',
      orders: [{
        product_id: undefined,
        user_id: 5,
        notes: 'deep insert test 1'
      }, {
        product_id: undefined,
        user_id: 6,
        notes: 'deep insert test 2'
      }]
    });

    assert.equal(res.name, 'something');

    const orders = yield db.orders.find({product_id: res.id});

    assert.lengthOf(orders, 2);

    const order1 = orders.find(o => o.user_id === 5);
    assert.equal(order1.notes, 'deep insert test 1');

    const order2 = orders.find(o => o.user_id === 6);
    assert.equal(order2.notes, 'deep insert test 2');
  });
});
