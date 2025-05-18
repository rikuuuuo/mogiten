// 模擬店のレジシステム

// 商品を格納するカート（オブジェクト形式）
let cart = {};
// 注文番号をローカルストレージから取得（なければ1）
let orderNumber = parseInt(localStorage.getItem('orderNumber') || '1');
// 注文履歴（チェックリスト用）
let orders = [];

// 商品をカートに追加する
function addItem(name, price) {
  // 商品がカートに無ければ初期化
  if (!cart[name]) cart[name] = { count: 0, price: price };
  // 商品の個数を1増やす
  cart[name].count++;
  // カート内容を更新
  updateCart();
}

// カート内容を画面に表示・更新
function updateCart() {
  const ul = document.getElementById('cart-list');
  const totalEl = document.getElementById('total');
  // カートリストをクリア
  ul.innerHTML = '';
  let total = 0;
  for (let item in cart) {
    if (cart[item].count > 0) {
      // 商品ごとにリスト要素を作成し追加
      const li = document.createElement('li');
      li.textContent = `${item} x${cart[item].count} = ¥${cart[item].count * cart[item].price}`;
      ul.appendChild(li);
      // 合計金額を計算
      total += cart[item].count * cart[item].price;
    }
  }
  // 合計金額をDOMに反映
  totalEl.textContent = total;
  // お釣りを更新
  updateChange();
  // 現金入力欄をリセット
  document.getElementById('cash').value = 0;
}

// お釣りを計算して表示
function updateChange() {
  const total = parseInt(document.getElementById('total').textContent);
  const cash = parseInt(document.getElementById('cash').value || '0');
  const change = cash - total;
  document.getElementById('change').textContent = change >= 0 ? change : 0;
}

// カートの内容をすべてキャンセル（リセット）
function cancel(){
    if (confirm('カートを空にしますか')){
        cart = {};
        updateCart();
        document.getElementById('cash').value = 0;
        updateChange();
    }
}

function m500(){
    const input = document.getElementById('cash');
    input.value = parseInt(input.value || '0') + 500;
    updateChange();
}

function m1000(){
    const input = document.getElementById('cash');
    input.value = parseInt(input.value || '0') + 1000;
    updateChange();
}

function m5000(){
    const input = document.getElementById('cash');
    input.value = parseInt(input.value || '0') + 5000;
    updateChange();
}

function m10000(){
    const input = document.getElementById('cash');
    input.value = parseInt(input.value || '0') + 10000;
    updateChange();
}

function paypay(){
    const total = parseInt(document.getElementById('total').textContent);
    document.getElementById('cash').value = total;
    updateChange();
}

// 会計処理（注文記録を作成しチェックリストに追加）
function checkout() {
  const total = parseInt(document.getElementById('total').textContent);
  // 商品が選択されていない場合はエラー
  if (total === 0) return alert('商品を選んでください');

  // 注文内容を作成
  const now = new Date();
  const items = Object.entries(cart).map(([name, data]) => `${name}x${data.count}`).join(', ');
  const cash = parseInt(document.getElementById('cash').value || '0');
  const change = cash - total;

  const order = {
    number: `#${String(orderNumber).padStart(3, '0')}`,
    items,
    total,
    cash,
    change,
    time: now.toLocaleString()
  };

  // 注文履歴に追加し、チェックリストにも表示
  orders.push(order);
  addToChecklist(order);

  // 注文番号を更新し、画面をリセット
  orderNumber++;
  localStorage.setItem('orderNumber', orderNumber);
  cart = {};
  updateCart();
  document.getElementById('change').textContent = 0;
}


// チェックリストに注文を追加する
function addToChecklist(order) {
  const tbody = document.querySelector('#order-table tbody');
  const tr = document.createElement('tr');
  const checkId = 'chk_' + order.number;
  tr.innerHTML = `
    <td>${order.number}</td>
    <td>${order.items}</td>
    <td>¥${order.total}</td>
    <td>¥${order.cash}</td>
    <td>¥${order.change}</td>
    <td>${order.time}</td>
    <td><button id="${checkId}" onclick="markAsDelivered('${checkId}')">未渡し</button></td>
  `;
  tbody.appendChild(tr);
}

// 「渡した」ボタンを✔に変更し無効化
function markAsDelivered(id) {
  const btn = document.getElementById(id);
  btn.textContent = '✔ 渡した';
  btn.disabled = true;
}

// チェックリストの表示・非表示を切り替える
function toggleChecklist() {
  const el = document.getElementById('checklist');
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}