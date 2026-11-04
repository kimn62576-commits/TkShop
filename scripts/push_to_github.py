import subprocess
import sys
import os

os.system('cls' if os.name == 'nt' else 'clear')

print("=" * 66)
print("       HE THONG DAY MA NGUON TKSHOP.VN LEN GITHUB")
print("=" * 66)
print()
print("Buoc 1: Mo trinh duyet vao: https://github.com/new")
print("Buoc 2: Dat ten Repository (vi du: tkshop)")
print("Buoc 3: Chon Private (hoac Public) va bam 'Create repository'")
print("Buoc 4: Copy link Repo (vi du: https://github.com/username/tkshop.git)")
print()
print("=" * 66)
print()

repo_dir = r"C:\Users\H2PC\Desktop\roblox-asset-marketplace"
os.chdir(repo_dir)

try:
    repo_url = input(">> Dan duong link GitHub Repo vao day roi bam ENTER:\n").strip()
except Exception:
    sys.exit(0)

if not repo_url:
    print("\n[LOI] Ban chua nhap link GitHub! Vui long chay lai.")
    input("\nBam Enter de thoat...")
    sys.exit(1)

# Clean quotes if user pasted with quotes
repo_url = repo_url.strip('"').strip("'").strip()

print(f"\n[1/3] Dang lien ket voi Repository: {repo_url}")
subprocess.run(["git", "remote", "remove", "origin"], capture_output=True)
res_add = subprocess.run(["git", "remote", "add", "origin", repo_url], capture_output=True, text=True)

subprocess.run(["git", "branch", "-M", "main"], capture_output=True)

print("\n[2/3] Dang chuan bi ma nguon va commit moi nhat...")
subprocess.run(["git", "add", "."], capture_output=True)
subprocess.run(["git", "commit", "-m", "TKSHOP.VN - Full Source Code & Database"], capture_output=True)

print("\n[3/3] Dang day ma nguon len GitHub (git push -u origin main)...")
print("(Luu y: Neu GitHub yeu cau xac nhan, trinh duyet se mo len de ban bam Sign In)\n")

res_push = subprocess.run(["git", "push", "-u", "origin", "main"])

if res_push.returncode == 0:
    print("\n" + "=" * 66)
    print("   THANH CONG RUC RO! TOAN BO MA NGUON DA LEN GITHUB!")
    print("=" * 66)
    print("Bay gio ban co the vao https://vercel.com de Deploy chi voi 1 click!")
else:
    print("\n" + "=" * 66)
    print("Neu gap loi tu choi (rejected/conflict), he thong se thu day de:")
    print("=" * 66)
    ask = input("Ban co muon thu force push len de khong? (y/n): ").strip().lower()
    if ask in ['y', 'yes']:
        subprocess.run(["git", "push", "-u", "origin", "main", "--force"])

print()
input("Bam phim ENTER de dong cua so...")
