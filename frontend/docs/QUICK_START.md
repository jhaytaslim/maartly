# 🚀 Quick Start Guide

Get Stockly up and running in under 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages (~2-3 minutes)

### 2. Fix Import Statements

**Choose your operating system:**

**Mac/Linux:**
```bash
chmod +x fix-imports.sh
./fix-imports.sh
```

**Windows:**
```powershell
powershell -ExecutionPolicy Bypass -File fix-imports.ps1
```

**Manual (Any OS):**
- Open your editor's Find & Replace (Ctrl+Shift+H)
- Find: `@radix-ui/([^@"]+)@[0-9.]+"`
- Replace: `@radix-ui/$1"`
- Replace All
- Repeat for: `lucide-react@`, `class-variance-authority@`, etc.

### 3. Start Development Server

```bash
npm run dev
```

### 4. Open in Browser

Navigate to: **http://localhost:5173**

## 🎯 What You'll See

### Landing Page (First Screen)
- Professional marketing page
- Features showcase
- Pricing plans
- **Click "Login" or "View Demo" to enter the app**

### Main Application
After login, you'll have access to:
- ✅ Dashboard with analytics
- ✅ Point of Sale (POS)
- ✅ Inventory Management
- ✅ Order Management
- ✅ Employee & Customer Management
- ✅ Reports & Analytics

## 🎮 Quick Tour

### 1. Try the POS System
- Click **"Point of Sale"** in sidebar
- Click products to add to cart
- Click **"Scan"** to test barcode scanning
- Try **"Hold"** to save order for later
- Click **"Checkout"** to complete sale

### 2. Manage Inventory
- Go to **"Products"**
- Click **"Add Product"**
- Generate QR codes
- Set low stock alerts

### 3. View Analytics
- Check **"Dashboard"** for overview
- See sales trends
- Monitor low stock items
- Track employee performance

## 🔧 Common Issues

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173
# Then restart
npm run dev
```

### Import Errors
- Make sure you ran the import fix script
- Check that no imports have `@x.x.x` version numbers
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules .next dist
npm install
npm run build
```

### Blank Page
- Check browser console for errors (F12)
- Ensure all imports are correct
- Try clearing browser cache (Ctrl+Shift+R)

## 📱 Testing Features

### POS Features
1. **Scanner**: Enter "HPL-450" or "LOG-M185"
2. **Hold Orders**: Add items, click "Hold", retrieve from "Held" button
3. **Payment Methods**: Test Card, Cash, Digital Wallet
4. **Receipt**: Complete sale to see receipt

### Inventory Features
1. **Add Product**: Use the form to add new items
2. **Edit Category**: Click edit icon on any category
3. **Low Stock**: Check alerts page for items needing restock
4. **Transfer**: Move products between stores

### Management Features
1. **Employees**: Add staff and view engagement reports
2. **Customers**: Manage customer database
3. **Stores**: Multi-location support
4. **Pricing**: Configure payment methods and plans

## 🎨 Customization

### Change Colors
Edit `/styles/globals.css`:
```css
:root {
  --primary: #your-color;
  --secondary: #your-color;
}
```

### Update Landing Page
Edit `/components/pages/landing-page.tsx`:
- Change pricing plans
- Update testimonials
- Modify feature list
- Change company info

### Configure Payment
1. Go to **Pricing Plans > Payment Methods**
2. Click **Configure**
3. Enter API keys (use test keys for development)

## 📦 Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview

# Deploy to Vercel (recommended)
npm install -g vercel
vercel
```

## 🆘 Need Help?

1. **Check Documentation**
   - README.md - Full documentation
   - UPDATE_INSTRUCTIONS.md - Latest changes
   - DEPLOYMENT.md - Deployment guide

2. **Common Solutions**
   - Clear cache and restart
   - Reinstall dependencies
   - Check browser console
   - Verify Node.js version (18+)

3. **Debug Mode**
   ```bash
   # Run with debug output
   DEBUG=* npm run dev
   ```

## ✅ Success Checklist

- [ ] Dependencies installed
- [ ] Import fix script run successfully
- [ ] Dev server starts without errors
- [ ] Landing page loads in browser
- [ ] Can login/enter app
- [ ] Dashboard displays correctly
- [ ] POS system works
- [ ] Can add/edit products
- [ ] No console errors

## 🚀 Next Steps

1. **Explore Features**
   - Try all pages
   - Test POS system
   - Create sample data

2. **Customize**
   - Update branding
   - Configure payment gateways
   - Add your products

3. **Deploy**
   - Build for production
   - Deploy to Vercel/Netlify
   - Set up custom domain

## 💡 Pro Tips

- Use **Cmd/Ctrl + K** to search
- Hold orders in POS for quick access
- Set low stock alerts for automation
- Use table view in POS for compact display
- Enable offline mode in settings
- Export reports for accounting

## 🎉 You're All Set!

Your Stockly inventory system is ready to use. Start by exploring the landing page, then dive into the POS and inventory features.

**Happy Managing! 🎊**

---

Questions? Check out the full README.md or DEPLOYMENT.md for more details.
