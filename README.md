# Meme Universe 🚀

A simple web app that fetches and displays trending memes from Reddit. Built with vanilla JavaScript and hosted on GitHub Pages.

## Features
- Fetches trending memes from popular subreddits
- Clean, modern UI with dark mode
- Direct meme download functionality
- Mobile-responsive design

## Live Demo
Visit [https://abhishekwagh20.github.io/meme-universe](https://abhishekwagh20.github.io/meme-universe)

## Deployment
This site is deployed using GitHub Pages. Here's how to deploy your own instance:

1. Fork this repository
2. Go to your fork's Settings > Pages
3. Under "Source", select "GitHub Actions"
4. The site will be automatically deployed when you push changes to the main branch

### Custom Domain (Optional)
To use a custom domain:

1. Go to your repository's Settings > Pages
2. Under "Custom domain", enter your domain
3. Add these DNS records at your domain provider:
   - Type: A
   - Name: @
   - Value: 185.199.108.153
   - Value: 185.199.109.153
   - Value: 185.199.110.153
   - Value: 185.199.111.153

   For www subdomain:
   - Type: CNAME
   - Name: www
   - Value: YOUR_USERNAME.github.io

4. Wait for DNS to propagate (can take up to 24 hours)

## Local Development
1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/meme-universe.git
cd meme-universe
```

2. Open index.html in your browser
3. No build process needed!

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` for more information.
