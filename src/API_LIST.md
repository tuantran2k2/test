# Tổng hợp các API đã sử dụng trong dự án Dexscreener Clone

## 1. Moralis API (deep-index.moralis.io & solana-gateway.moralis.io)

### 1.1. Lấy danh sách token trending
- **Endpoint:** `GET https://deep-index.moralis.io/api/v2.2/tokens/trending?limit={limit}&chain={chain}`
- **Tham số:**
  - `limit` (number, mặc định 100): Số lượng token trả về
  - `chain` (string, optional): Chain ID (ví dụ: 0x1 cho Ethereum, solana cho Solana...)
- **Chức năng:** Lấy danh sách các token đang trending trên các blockchain được hỗ trợ.
- **Sử dụng tại:** TrendingPage, services/api.js

### 1.2. Tìm kiếm token
- **Endpoint:** `GET https://deep-index.moralis.io/api/v2.2/tokens/search?query={query}&chains={chains}&limit={limit}`
- **Tham số:**
  - `query` (string): Từ khóa tìm kiếm
  - `chains` (string, ví dụ: eth,solana,bsc,base): Danh sách chain cần tìm kiếm
  - `limit` (number, mặc định 20): Số lượng kết quả trả về
- **Chức năng:** Tìm kiếm token theo tên, symbol hoặc địa chỉ trên nhiều chain.
- **Sử dụng tại:** services/api.js

### 1.3. Lấy giá token
- **Endpoint:** `GET https://deep-index.moralis.io/api/v2.2/tokens/{chain}/{tokenAddress}/price`
- **Tham số:**
  - `chain` (string): Chain ID (theo format Moralis)
  - `tokenAddress` (string): Địa chỉ token
- **Chức năng:** Lấy thông tin giá hiện tại của token trên chain tương ứng.
- **Sử dụng tại:** services/api.js

### 1.4. Lấy Net Worth của ví
- **Endpoint:** `GET https://deep-index.moralis.io/api/v2.2/wallets/{address}/net-worth?chains[0]=eth&chains[1]=bsc...&exclude_spam=true&exclude_unverified_contracts=true`
- **Tham số:**
  - `address` (string): Địa chỉ ví
  - `chains[]` (array): Danh sách chain cần lấy dữ liệu
  - `exclude_spam`, `exclude_unverified_contracts` (boolean): Loại trừ token spam và contract chưa xác thực
- **Chức năng:** Lấy tổng giá trị tài sản (Net Worth) của ví trên nhiều chain.
- **Sử dụng tại:** PortfolioPage, services/api.js

### 1.5. Lấy danh sách token của ví trên 1 chain
- **Endpoint:** `GET https://deep-index.moralis.io/api/v2.2/wallets/{address}/tokens?chain={chain}`
- **Tham số:**
  - `address` (string): Địa chỉ ví
  - `chain` (string): Chain ID
- **Chức năng:** Lấy danh sách token mà ví đang nắm giữ trên 1 chain cụ thể.
- **Sử dụng tại:** PortfolioPage, services/api.js

### 1.6. Lấy danh sách cặp giao dịch của token
- **Endpoint:**
  - EVM: `GET https://deep-index.moralis.io/api/v2.2/erc20/{tokenAddress}/pairs?chain={chainId}`
  - Solana: `GET https://solana-gateway.moralis.io/token/mainnet/{tokenAddress}/pairs`
- **Tham số:**
  - `tokenAddress` (string): Địa chỉ token
  - `chainId` (string): Chain ID
- **Chức năng:** Lấy danh sách các cặp giao dịch (pairs) của token trên các sàn DEX.
- **Sử dụng tại:** TokenPage

### 1.7. Lấy thông tin metadata của token
- **Endpoint:**
  - EVM: `GET https://deep-index.moralis.io/api/v2.2/erc20/metadata?chain={chainId}&addresses[0]={tokenAddress}`
  - Solana: `GET https://solana-gateway.moralis.io/token/mainnet/{tokenAddress}/metadata`
- **Tham số:**
  - `tokenAddress` (string): Địa chỉ token
  - `chainId` (string): Chain ID
- **Chức năng:** Lấy metadata (tên, symbol, decimals, logo, ...) của token.
- **Sử dụng tại:** TokenInfo.js

### 1.8. Lấy danh sách giao dịch (swaps) của cặp giao dịch
- **Endpoint:**
  - EVM: `GET https://deep-index.moralis.io/api/v2.2/pairs/{pairAddress}/swaps?chain={chainId}&order=DESC`
  - Solana: `GET https://solana-gateway.moralis.io/token/mainnet/pairs/{pairAddress}/swaps?order=DESC`
- **Tham số:**
  - `pairAddress` (string): Địa chỉ cặp giao dịch
  - `chainId` (string): Chain ID
  - `order` (string): Thứ tự (DESC)
- **Chức năng:** Lấy lịch sử giao dịch (mua/bán) của cặp giao dịch.
- **Sử dụng tại:** TokenTransactions.js

### 1.9. Lấy danh sách snipers của cặp giao dịch
- **Endpoint:**
  - EVM: `GET https://deep-index.moralis.io/api/v2.2/pairs/{pairAddress}/snipers?chain={chainId}&blocksAfterCreation=1000`
  - Solana: `GET https://solana-gateway.moralis.io/token/mainnet/pairs/{pairAddress}/snipers?blocksAfterCreation=1000`
- **Tham số:**
  - `pairAddress` (string): Địa chỉ cặp giao dịch
  - `chainId` (string): Chain ID
  - `blocksAfterCreation` (number): Số block sau khi tạo pair (mặc định 1000)
- **Chức năng:** Lấy danh sách các snipers (ví mua sớm) của cặp giao dịch.
- **Sử dụng tại:** TokenSnipers.js

### 1.10. Lấy danh sách holders của token (EVM)
- **Endpoint:** `GET https://deep-index.moralis.io/api/v2.2/erc20/{tokenAddress}/owners?chain={chainId}&order=DESC`
- **Tham số:**
  - `tokenAddress` (string): Địa chỉ token
  - `chainId` (string): Chain ID
  - `order` (string): Thứ tự (DESC)
- **Chức năng:** Lấy danh sách holders (ví nắm giữ token) trên EVM chain.
- **Sử dụng tại:** TokenHolders.js

### 1.11. Lọc token nâng cao (Discovery)
- **Endpoint:** `POST https://deep-index.moralis.io/api/v2.2/discovery/tokens`
- **Body:**
```json
{
  "chain": "0x1",
  "filters": [
    { "metric": "experiencedBuyers", "timeFrame": "oneMonth", "gt": "10" }
  ],
  "sortBy": { "metric": "experiencedBuyers", "timeFrame": "oneMonth", "type": "DESC" },
  "timeFramesToReturn": ["tenMinutes", "oneHour", ...],
  "metricsToReturn": ["holders", "buyers", ...],
  "limit": 20
}
```
- **Chức năng:** Lọc token theo nhiều điều kiện nâng cao (số lượng holders, volume, marketcap, ...), trả về danh sách token phù hợp.
- **Sử dụng tại:** FiltersModal/index.js

### 1.12. Lấy token pump.fun trên Solana
- **Endpoint:**
  - New: `GET https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/new?limit=100`
  - Bonding: `GET https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/bonding?limit=100`
  - Graduated: `GET https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/graduated?limit=100`
- **Tham số:**
  - `limit` (number): Số lượng token trả về
- **Chức năng:** Lấy danh sách các token mới, đang bonding, đã graduated trên pump.fun (Solana DEX).
- **Sử dụng tại:** PumpFunPage.js

---

## 2. Tổng kết
- Tất cả các API đều yêu cầu header `X-API-Key` (Moralis API Key)
- Chủ yếu sử dụng các endpoint của Moralis cho cả EVM và Solana
- Các chức năng chính: lấy trending, tìm kiếm, giá, net worth, holders, giao dịch, snipers, lọc nâng cao, pump.fun

> **Lưu ý:** Một số API chỉ áp dụng cho EVM hoặc Solana, cần kiểm tra chainId khi gọi API. 