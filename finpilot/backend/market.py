import sys
import json
import yfinance as yf

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
