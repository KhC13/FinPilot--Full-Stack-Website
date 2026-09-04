import sys
import json
import yfinance as yf
import requests

INDEX_SYMBOLS = {
    "nifty50": "^NSEI",
    "sensex": "^BSESN",
    "bankNifty": "^NSEBANK",
}

def quote(symbol):
    ticker = yf.Ticker(symbol)
    data = ticker.history(period="2d", interval="1m")

    if data.empty:
        data = ticker.history(period="5d", interval="1d")

    if data.empty:
        return None

    closes = data["Close"].dropna()
    if closes.empty:
        return None

    latest = float(closes.iloc[-1])
    previous = float(closes.iloc[-2]) if len(closes) > 1 else latest
    change = latest - previous
    percent = (change / previous * 100) if previous else 0

    return {
        "value": round(latest, 2),
        "change": round(change, 2),
        "percentChange": round(percent, 2),
        "state": "up" if change >= 0 else "down",
    }

def normalize_symbol(symbol):
    s = symbol.strip().upper()
    if not s.endswith(".NS") and not s.endswith(".BO") and not s.startswith("^"):
        s = f"{s}.NS"
    return s

def search_stocks(query):
    q = query.strip()
    if len(q) < 2:
        return []

    url = "https://query2.finance.yahoo.com/v1/finance/search"
    headers = {"User-Agent": "Mozilla/5.0"}

    response = requests.get(
        url,
        params={"q": q, "quotesCount": 20, "newsCount": 0},
        headers=headers,
        timeout=10,
    )
    response.raise_for_status()
    payload = response.json()

    results = []
    seen = set()

    for item in payload.get("quotes", []):
        symbol = str(item.get("symbol", "")).upper().strip()
        quote_type = str(item.get("quoteType", "")).upper()

        # FinPilot currently targets Indian listed equities.
        if quote_type not in {"EQUITY", "ETF"}:
            continue
        if not (symbol.endswith(".NS") or symbol.endswith(".BO")):
            continue
        if symbol in seen:
            continue

        seen.add(symbol)
        results.append({
            "symbol": symbol,
            "displaySymbol": symbol.replace(".NS", "").replace(".BO", ""),
            "name": item.get("shortname") or item.get("longname") or symbol,
            "exchange": item.get("exchange") or ("NSE" if symbol.endswith(".NS") else "BSE"),
            "quoteType": quote_type,
        })

        if len(results) >= 12:
            break

    return results

def history(symbol, range_name):
    periods = {
        "1D": ("2d", "5m"),
        "1W": ("7d", "30m"),
        "1M": ("1mo", "1h"),
        "6M": ("6mo", "1d"),
        "1Y": ("1y", "1d"),
    }

    period, interval = periods.get(range_name.upper(), periods["1M"])
    ticker = yf.Ticker(symbol)
    data = ticker.history(period=period, interval=interval)

    if data.empty:
        return []

    result = []
    for timestamp, row in data.iterrows():
        close = row.get("Close")
        if close is None:
            continue

        try:
            result.append({
                "date": timestamp.strftime("%d %b" if period in ("7d", "1mo") else "%d %b %y"),
                "price": round(float(close), 2),
            })
        except (TypeError, ValueError):
            continue

    return result

def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "overview"

    if mode == "overview":
        result = {}
        for name, symbol in INDEX_SYMBOLS.items():
            item = quote(symbol)
            if item:
                result[name] = item
        print(json.dumps(result))
        return

    if mode == "prices":
        raw_symbols = sys.argv[2:] if len(sys.argv) > 2 else []
        result = {}
        for raw in raw_symbols:
            symbol = normalize_symbol(raw)
            item = quote(symbol)
            if item:
                result[raw.strip().upper()] = {
                    **item,
                    "symbol": symbol,
                }
        print(json.dumps(result))
        return

    if mode == "search":
        query = sys.argv[2] if len(sys.argv) > 2 else ""
        try:
            print(json.dumps(search_stocks(query)))
        except Exception as error:
            print(json.dumps({"error": str(error)}))
            sys.exit(1)
        return

    if mode == "history":
        raw_symbol = sys.argv[2] if len(sys.argv) > 2 else "RELIANCE"
        range_name = sys.argv[3] if len(sys.argv) > 3 else "1M"
        symbol = normalize_symbol(raw_symbol)
        print(json.dumps(history(symbol, range_name)))
        return

    print(json.dumps({"error": "Unknown mode"}))
    sys.exit(1)

if __name__ == "__main__":
    main()
