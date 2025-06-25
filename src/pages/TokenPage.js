import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import TokenChart from "../components/token/TokenChart";
import TokenInfo from "../components/token/TokenInfo";
import TokenTabs from "../components/token/TokenTabs";
import PairSelector from "../components/token/PairSelector";
import TokenTransactions from "../components/token/TokenTransactions";
import TokenHolders from "../components/token/TokenHolders";
import TokenSnipers from "../components/token/TokenSnipers";
import TokenHolderInsights from "../components/token/TokenHolderInsights";

const API_KEY = process.env.REACT_APP_MORALIS_API_KEY;

// Map URL path segments to Moralis chain IDs
const PATH_TO_CHAIN_ID = {
  ethereum: "0x1",
  binance: "0x38",
  bsc: "0x38",
  polygon: "0x89",
  solana: "solana",
  arbitrum: "0xa4b1",
  base: "0x2105",
  avalanche: "0xa86a",
  optimism: "0xa",
  linea: "0xe708",
  fantom: "0xfa",
  pulse: "0x171",
  ronin: "0x7e4",
};

const TokenPage = () => {
  const { chainId: chainPath, tokenAddress } = useParams();
  const location = useLocation();
  const [loadingState, setLoadingState] = useState("initial"); // 'initial', 'data', 'complete'
  const [tokenInfo, setTokenInfo] = useState(null);
  const [pairs, setPairs] = useState([]);
  const [selectedPair, setSelectedPair] = useState(null);
  const [activeTab, setActiveTab] = useState("transactions");
  const [timeFrame, setTimeFrame] = useState("1h");
  const [error, setError] = useState(null);

  // Convert URL path parameter to chain ID for API
  const getApiChainId = (chainPath) => {
    const chainMap = {
      ethereum: "0x1",
      binance: "0x38",
      bsc: "0x38",
      polygon: "0x89",
      solana: "solana",
      arbitrum: "0xa4b1",
      base: "0x2105",
      avalanche: "0xa86a",
      optimism: "0xa",
      linea: "0xe708",
      fantom: "0xfa",
      pulse: "0x171",
      ronin: "0x7e4",
    };

    return chainMap[chainPath] || chainPath;
  };

  const chainId = getApiChainId(chainPath);
  const isSolana = chainId === "solana";

  useEffect(() => {
    // Reset loading state when navigating to a new token
    setLoadingState("initial");

    console.log("TokenPage mounted with params:", {
      chainPath,
      tokenAddress,
      chainId: getApiChainId(chainPath),
    });

    // Check if API_KEY is available (don't log the actual key)
    console.log("API key available:", !!API_KEY);

    // Minimum loading time to prevent flashing
    const minLoadTimer = setTimeout(() => {
      setLoadingState("data");
    }, 300);

    return () => {
      console.log("TokenPage unmounted");
      clearTimeout(minLoadTimer);
    };
  }, [chainPath, tokenAddress]);

  // Check if token data was passed via navigation state
  useEffect(() => {
    const tokenDataFromState = location.state?.tokenData;
    if (tokenDataFromState) {
      setTokenInfo(tokenDataFromState);
    }
  }, [location]);

  // Fetch token pairs
  useEffect(() => {
    const fetchTokenPairs = async () => {
      try {
        let url;

        if (isSolana) {
          // Solana endpoint
          url = `https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/pairs`;
        } else {
          // EVM endpoint
          url = `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/pairs?chain=${chainId}`;
        }

        console.log("Fetching from URL:", url);

        const response = await fetch(url, {
          headers: {
            accept: "application/json",
            "X-API-Key": API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Token pairs response:", data);

        // Normalize data from different API formats
        const pairsData = data.pairs || [];

        if (pairsData.length > 0) {
          // Create normalized pairs data with consistent property names
          const normalizedPairs = pairsData.map((pair) => {
            // Handle both snake_case and camelCase formats
            return {
              chainId: chainId,
              pairAddress: pair.pairAddress || pair.pair_address,
              exchangeName: pair.exchangeName || pair.exchange_name,
              exchangeLogo: pair.exchangeLogo || pair.exchange_logo,
              pairLabel: pair.pairLabel || pair.pair_label,
              liquidityUsd: pair.liquidityUsd || pair.liquidity_usd,
              usdPrice: pair.usdPrice || pair.usd_price,
              usdPrice24hrPercentChange:
                pair.usdPrice24hrPercentChange ||
                pair.usd_price_24hr_percent_change,
              volume24hrUsd: pair.volume24hrUsd || pair.volume_24h_usd,
              baseToken: pair.baseToken || pair.base_token,
              quoteToken: pair.quoteToken || pair.quote_token,
              pair: Array.isArray(pair.pair)
                ? pair.pair.map((token) => ({
                    tokenAddress: token.tokenAddress || token.token_address,
                    tokenName: token.tokenName || token.token_name,
                    tokenSymbol: token.tokenSymbol || token.token_symbol,
                    tokenLogo: token.tokenLogo || token.token_logo,
                    tokenDecimals: token.tokenDecimals || token.token_decimals,
                    pairTokenType: token.pairTokenType || token.pair_token_type,
                    liquidityUsd: token.liquidityUsd || token.liquidity_usd,
                  }))
                : [],
            };
          });

          console.log("Normalized pairs data:", normalizedPairs);
          setPairs(normalizedPairs);

          // Select the first pair by default
          setSelectedPair(normalizedPairs[0]);

          // Extract token info from the first pair if we don't have it yet
          if (
            !tokenInfo &&
            normalizedPairs[0].pair &&
            normalizedPairs[0].pair.length > 0
          ) {
            // Try to find the token in the pair data
            const currentToken = normalizedPairs[0].pair.find(
              (token) =>
                token.tokenAddress &&
                token.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()
            );

            if (currentToken) {
              setTokenInfo({
                address: tokenAddress,
                name: currentToken.tokenName,
                symbol: currentToken.tokenSymbol,
                logo: currentToken.tokenLogo,
                decimals: currentToken.tokenDecimals,
              });
            } else {
              // Fallback if token not found in pair data
              console.log(
                "Token not found in pair data, using first token as fallback"
              );
              const fallbackToken = normalizedPairs[0].pair[0];
              setTokenInfo({
                address: tokenAddress,
                name:
                  fallbackToken?.tokenName ||
                  `Token ${tokenAddress.substring(0, 6)}...`,
                symbol: fallbackToken?.tokenSymbol || "TOKEN",
                logo: fallbackToken?.tokenLogo || null,
                decimals: fallbackToken?.tokenDecimals || "18",
              });
            }
          }

          // Set loading to complete once we have the pairs data
          setLoadingState("complete");
        } else {
          console.log("No pairs found for this token");
          setError("No trading pairs found for this token");
          setLoadingState("complete");
        }
      } catch (error) {
        console.error("Error fetching token pairs:", error);
        setError(`Error loading token data: ${error.message}`);
        setLoadingState("complete");
      }
    };

    if (tokenAddress && chainId && loadingState === "data") {
      fetchTokenPairs();
    }
  }, [chainId, tokenAddress, tokenInfo, isSolana, loadingState]);

  // Handle pair selection
  const handlePairSelect = (pairAddress) => {
    const pair = pairs.find((p) => p.pairAddress === pairAddress);
    if (pair) {
      setSelectedPair(pair);
    }
  };

  // Handle time frame change
  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  // Update activeTab if it's set to "holders" for Solana tokens
  useEffect(() => {
    if (isSolana && activeTab === "holders") {
      setActiveTab("transactions");
    }
  }, [isSolana, activeTab]);

  // Loading spinner - consistent for all loading states except 'complete'
  if (loadingState !== "complete") {
    return (
      <div className="flex-1 relative h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-dex-blue mx-auto mb-4"></div>
            <div className="text-xl text-dex-text-secondary">
              Loading token data...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-xl text-dex-text-secondary">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-dex-bg-primary">
      <div className="flex flex-col lg:flex-row h-[70vh]">
        {/* Left side - Chart section */}
        <div className="flex-1 p-4">
          <TokenChart
            pair={selectedPair}
            timeFrame={timeFrame}
            onTimeFrameChange={handleTimeFrameChange}
          />
        </div>

        {/* Right side - Token info section */}
        <div className="w-full lg:w-80 xl:w-96 border-l border-dex-border overflow-y-auto">
          {/* Pair selector dropdown moved to top of right column */}
          {pairs.length > 1 && (
            <div className="border-b border-dex-border p-4">
              <PairSelector
                pairs={pairs}
                selectedPair={selectedPair}
                onSelect={handlePairSelect}
              />
            </div>
          )}

          <TokenInfo
            token={tokenInfo}
            pair={selectedPair}
            timeFrame={timeFrame}
            chainId={chainId}
          />
        </div>
      </div>

      {/* Tabs section */}
      <div className="border-t border-dex-border">
        <TokenTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          isSolana={isSolana}
        />
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "transactions" && (
          <TokenTransactions
            pair={selectedPair}
            chainId={selectedPair?.chainId}
          />
        )}

        {activeTab === "holders" && (
          <TokenHolders token={tokenInfo} chainId={chainId} />
        )}

        {activeTab === "holder-insights" && (
          <TokenHolderInsights token={tokenInfo} chainId={chainId} />
        )}

        {activeTab === "snipers" && (
          <TokenSnipers
            token={tokenInfo}
            pair={selectedPair}
            chainId={chainId}
          />
        )}
      </div>
    </div>
  );
};

export default TokenPage;
