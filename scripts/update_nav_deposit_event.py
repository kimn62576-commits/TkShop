file_path = r"C:\Users\H2PC\.gemini\antigravity\scratch\roblox-asset-marketplace\src\components\layout\Navbar.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

old_block = '''  useEffect(() => {
    fetchUser();
    const handleRefresh = () => fetchUser();
    window.addEventListener("refreshUser", handleRefresh);
    return () => window.removeEventListener("refreshUser", handleRefresh);
  }, []);'''

new_block = '''  useEffect(() => {
    fetchUser();
    const handleRefresh = () => fetchUser();
    const handleOpenDepositEvent = () => handleOpenDeposit();
    window.addEventListener("refreshUser", handleRefresh);
    window.addEventListener("openDepositModal", handleOpenDepositEvent);
    return () => {
      window.removeEventListener("refreshUser", handleRefresh);
      window.removeEventListener("openDepositModal", handleOpenDepositEvent);
    };
  }, [user]);'''

code = code.replace(old_block, new_block)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Updated Navbar.tsx with openDepositModal event listener!")
