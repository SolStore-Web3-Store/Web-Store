# Troubleshooting Guide

## Wallet Connection Issues

### "User rejected the request" Error

This error occurs when users decline the wallet connection in Phantom. This is normal behavior.

**Solution:**
1. Click "Connect Wallet" again
2. When Phantom popup appears, click "Connect" (not "Cancel")
3. Approve the connection request

### "Phantom wallet not detected" Error

**Solutions:**
1. **Install Phantom Wallet:**
   - Visit https://phantom.app/
   - Install the browser extension
   - Create or import a wallet
   - Refresh the page

2. **Check Browser Compatibility:**
   - Use Chrome, Firefox, or Edge
   - Disable ad blockers temporarily
   - Try incognito/private mode

3. **Extension Issues:**
   - Ensure Phantom extension is enabled
   - Pin the extension to your toolbar
   - Refresh the page after installation

### "Connection request already pending" Error

**Solution:**
1. Check if Phantom wallet popup is open in another tab
2. Close any pending Phantom popups
3. Try connecting again

### "Wallet is locked" Error

**Solution:**
1. Click on the Phantom extension icon
2. Enter your password to unlock
3. Try connecting again

## API Connection Issues

### "Failed to connect to server" Error

**Solutions:**
1. **Check Backend Server:**
   ```bash
   # Make sure backend is running on port 4000
   curl http://localhost:4000/health
   ```

2. **Check Environment Variables:**
   - Verify `.env.local` has correct API URL
   - Default: `NEXT_PUBLIC_API_URL=http://localhost:4000/v1`

3. **CORS Issues:**
   - Backend should allow `http://localhost:3000`
   - Check backend CORS configuration

### "Invalid wallet signature" Error

**Solutions:**
1. Try disconnecting and reconnecting wallet
2. Clear browser localStorage:
   ```javascript
   localStorage.clear()
   ```
3. Refresh the page and try again

## Store Creation Issues

### "Store slug already taken" Error

**Solution:**
1. Try a different slug name
2. Use hyphens instead of spaces
3. Add numbers or unique identifiers

### File Upload Issues

**Solutions:**
1. **File Size:** Ensure image is under 4MB
2. **File Type:** Use PNG, JPG, GIF, or WebP
3. **Network:** Check internet connection

## Development Issues

### TypeScript Errors

**Common fixes:**
1. Run `npm install` to ensure dependencies
2. Restart TypeScript server in VS Code
3. Check for missing type definitions

### Build Errors

**Solutions:**
1. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

2. Check for syntax errors in recent changes
3. Verify all imports are correct

## Debug Mode

Enable debug logging by setting `NODE_ENV=development`:

```bash
# In browser console, you'll see detailed logs:
# [SolStore Debug] Phantom wallet check: {...}
# [SolStore Debug] Wallet connection - Requesting wallet connection...
# [SolStore Debug] API POST /stores {...}
```

## Getting Help

If issues persist:

1. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Look for error messages in Console tab
   - Share relevant error messages

2. **Check Network Tab:**
   - See if API requests are failing
   - Check response status codes

3. **Test with Different Browser:**
   - Try Chrome, Firefox, or Edge
   - Test in incognito mode

4. **Verify Setup:**
   - Backend server running on port 4000
   - Frontend running on port 3000
   - Phantom wallet installed and unlocked
   - Environment variables configured

## Common Error Codes

- `4001`: User rejected request
- `-32002`: Request already pending  
- `-32603`: Wallet locked
- `CORS`: Cross-origin request blocked
- `NETWORK_ERROR`: Cannot reach backend
- `UNAUTHORIZED`: Invalid or expired token