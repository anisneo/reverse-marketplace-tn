import os
from pathlib import Path
import datetime

class ProjectTreeGenerator:
    def __init__(self, project_path):
        """
        Initialise le générateur d'arborescence
        """
        self.project_path = Path(project_path)
        self.tree_lines = []
        self.file_count = 0
        self.dir_count = 0
        self.file_types = {}
        
        # Dossiers à ignorer
        self.ignore_dirs = {
            'node_modules', 'vendor', 'dist', 'build', 
            '.next', '.nuxt', '__pycache__', '.git',
            'venv', 'env', 'coverage', '.idea', '.vscode',
            'logs', 'tmp', 'temp', 'cache', '.cache',
            'android', 'ios', 'Pods'  # Pour React Native
        }
        
        # Extensions à ignorer
        self.ignore_extensions = {
            '.pyc', '.pyo', '.pyd', '.so', '.dll', '.dylib',
            '.exe', '.msi', '.log', '.lock', '.map',
            '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg',
            '.mp4', '.mp3', '.wav', '.avi', '.mov',
            '.zip', '.rar', '.7z', '.tar', '.gz',
            '.pdf', '.doc', '.docx', '.xls', '.xlsx'
        }
        
        # Fichiers à ignorer
        self.ignore_files = {
            'package-lock.json', 'yarn.lock', 'composer.lock',
            '.DS_Store', 'Thumbs.db', '.env.local', '.env.example'
        }
    
    def generate_tree(self):
        """
        Génère l'arborescence complète
        """
        print(f"🌳 GÉNÉRATION DE L'ARBORESCENCE")
        print("=" * 70)
        print(f"📁 Projet : {self.project_path}")
        print(f"📅 Date : {datetime.datetime.now().strftime('%d/%m/%Y %H:%M')}")
        print("=" * 70)
        
        # Ajouter l'en-tête
        self.tree_lines.append(f"📁 {self.project_path.name}/")
        
        # Parcourir les dossiers
        for root, dirs, files in os.walk(self.project_path):
            # Filtrer les dossiers à ignorer
            dirs[:] = [d for d in dirs if d not in self.ignore_dirs and not d.startswith('.')]
            
            # Calculer le niveau d'indentation
            relative_path = Path(root).relative_to(self.project_path)
            if str(relative_path) == '.':
                level = 0
            else:
                level = len(relative_path.parts)
            
            # Ajouter les dossiers
            for dir_name in sorted(dirs):
                indent = "│   " * level + "├── "
                self.tree_lines.append(f"{indent}📁 {dir_name}/")
                self.dir_count += 1
            
            # Ajouter les fichiers
            for file_name in sorted(files):
                file_path = Path(root) / file_name
                
                # Vérifier si le fichier doit être ignoré
                if self.should_ignore_file(file_name, file_path):
                    continue
                
                indent = "│   " * level + "├── "
                
                # Ajouter des icônes selon le type de fichier
                icon = self.get_file_icon(file_name)
                size = self.get_file_size(file_path)
                ext = file_path.suffix.lower()
                
                self.tree_lines.append(f"{indent}{icon} {file_name} {size}")
                self.file_count += 1
                
                # Statistiques par extension
                if ext:
                    self.file_types[ext] = self.file_types.get(ext, 0) + 1
        
        return self.tree_lines
    
    def should_ignore_file(self, file_name, file_path):
        """
        Vérifie si un fichier doit être ignoré
        """
        # Ignorer certains fichiers
        if file_name in self.ignore_files:
            return True
        
        # Ignorer certaines extensions
        ext = file_path.suffix.lower()
        if ext in self.ignore_extensions:
            return True
        
        # Ignorer les fichiers de configuration sensibles
        if file_name.startswith('.env') and file_name != '.env.example':
            return True
        
        return False
    
    def get_file_icon(self, file_name):
        """
        Retourne une icône selon le type de fichier
        """
        ext = Path(file_name).suffix.lower()
        
        # Frontend
        if ext in ['.js', '.jsx']:
            return '🟨'
        elif ext in ['.ts', '.tsx']:
            return '🟦'
        elif ext in ['.html', '.htm']:
            return '🟧'
        elif ext in ['.css', '.scss', '.sass']:
            return '🟪'
        
        # Backend
        elif ext == '.py':
            return '🐍'
        elif ext == '.php':
            return '🐘'
        elif ext == '.java':
            return '☕'
        elif ext == '.go':
            return '🐹'
        
        # Mobile
        elif '.native' in file_name:
            return '📱'
        
        # Configuration
        elif ext in ['.json', '.yml', '.yaml', '.toml']:
            return '⚙️'
        
        # Templates
        elif ext in ['.ejs', '.pug', '.hbs']:
            return '📝'
        
        # Documentation
        elif ext == '.md':
            return '📖'
        elif ext == '.txt':
            return '📄'
        
        # Images
        elif ext in ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.ico']:
            return '🖼️'
        
        # Default
        else:
            return '📄'
    
    def get_file_size(self, file_path):
        """
        Retourne la taille du fichier formatée
        """
        try:
            size = file_path.stat().st_size
            if size < 1024:
                return f"({size} B)"
            elif size < 1024 * 1024:
                return f"({size / 1024:.1f} KB)"
            elif size < 1024 * 1024 * 1024:
                return f"({size / (1024 * 1024):.1f} MB)"
            else:
                return f"({size / (1024 * 1024 * 1024):.1f} GB)"
        except:
            return ""
    
    def print_tree(self):
        """
        Affiche l'arborescence
        """
        for line in self.tree_lines:
            print(line)
    
    def save_tree(self):
        """
        Sauvegarde l'arborescence dans un fichier
        """
        tree_path = self.project_path / 'arborescence.txt'
        
        try:
            with open(tree_path, 'w', encoding='utf-8') as f:
                # En-tête
                f.write("=" * 70 + "\n")
                f.write(f"ARBORESCENCE DU PROJET\n")
                f.write(f"Projet: {self.project_path}\n")
                f.write(f"Date: {datetime.datetime.now().strftime('%d/%m/%Y %H:%M')}\n")
                f.write("=" * 70 + "\n\n")
                
                # Arborescence
                for line in self.tree_lines:
                    f.write(line + "\n")
                
                # Statistiques
                f.write("\n" + "=" * 70 + "\n")
                f.write("STATISTIQUES\n")
                f.write("=" * 70 + "\n")
                f.write(f"📁 Dossiers: {self.dir_count}\n")
                f.write(f"📄 Fichiers: {self.file_count}\n")
                f.write(f"📊 Total: {self.dir_count + self.file_count} éléments\n\n")
                
                # Types de fichiers
                if self.file_types:
                    f.write("TYPES DE FICHIERS:\n")
                    f.write("-" * 40 + "\n")
                    for ext, count in sorted(self.file_types.items(), key=lambda x: x[1], reverse=True):
                        f.write(f"  {ext}: {count} fichiers\n")
            
            print(f"\n💾 Arborescence sauvegardée : {tree_path}")
        except Exception as e:
            print(f"⚠️  Erreur sauvegarde: {e}")
    
    def generate_stats(self):
        """
        Génère des statistiques sur le projet
        """
        print("\n" + "=" * 70)
        print("📊 STATISTIQUES DU PROJET")
        print("=" * 70)
        
        print(f"📁 Dossiers: {self.dir_count}")
        print(f"📄 Fichiers: {self.file_count}")
        print(f"📊 Total: {self.dir_count + self.file_count} éléments")
        
        if self.file_types:
            print("\n📋 TYPES DE FICHIERS:")
            for ext, count in sorted(self.file_types.items(), key=lambda x: x[1], reverse=True):
                print(f"  {ext}: {count} fichiers")

class TechTreeGenerator(ProjectTreeGenerator):
    """
    Version améliorée pour marketplace avec détection de technologies
    """
    def __init__(self, project_path):
        super().__init__(project_path)
        self.technologies = {
            'React': {'files': 0, 'extensions': ['.jsx', '.tsx']},
            'Next.js': {'files': 0, 'extensions': ['.jsx', '.tsx']},
            'React Native': {'files': 0, 'extensions': ['.native.js', '.native.ts']},
            'Node.js': {'files': 0, 'extensions': ['.js', '.ts']},
            'Python': {'files': 0, 'extensions': ['.py']},
            'PHP': {'files': 0, 'extensions': ['.php']},
            'HTML': {'files': 0, 'extensions': ['.html', '.htm']},
            'CSS': {'files': 0, 'extensions': ['.css', '.scss', '.sass']}
        }
    
    def generate_tech_report(self):
        """
        Génère un rapport des technologies détectées
        """
        for file_path in self.project_path.rglob('*'):
            if file_path.is_file():
                ext = file_path.suffix.lower()
                for tech, data in self.technologies.items():
                    if ext in data['extensions']:
                        data['files'] += 1
                    # Détection spéciale pour Next.js
                    if tech == 'Next.js' and 'next' in str(file_path).lower():
                        data['files'] += 1
                    # Détection spéciale pour React Native
                    if tech == 'React Native' and '.native.' in str(file_path).lower():
                        data['files'] += 1
        
        print("\n" + "=" * 70)
        print("🔧 TECHNOLOGIES DÉTECTÉES")
        print("=" * 70)
        
        for tech, data in sorted(self.technologies.items(), key=lambda x: x[1]['files'], reverse=True):
            if data['files'] > 0:
                print(f"  {tech}: {data['files']} fichiers")

def main():
    """
    Fonction principale
    """
    print("=" * 70)
    print("🌳 GÉNÉRATEUR D'ARBORESCENCE")
    print("=" * 70)
    
    # Demander le chemin
    project_path = input("\n📁 Chemin du projet: ").strip()
    
    if not project_path:
        project_path = "."
    
    if not os.path.exists(project_path):
        print(f"❌ Le chemin '{project_path}' n'existe pas.")
        return
    
    # Choisir le mode
    print("\n📋 Options:")
    print("  1. Arborescence simple")
    print("  2. Arborescence avec détection de technologies")
    
    choice = input("\nVotre choix (1 ou 2): ").strip()
    
    if choice == '2':
        generator = TechTreeGenerator(project_path)
    else:
        generator = ProjectTreeGenerator(project_path)
    
    # Générer l'arborescence
    generator.generate_tree()
    
    # Afficher
    print("\n" + "=" * 70)
    generator.print_tree()
    
    # Statistiques
    generator.generate_stats()
    
    # Technologies (si mode 2)
    if choice == '2':
        generator.generate_tech_report()
    
    # Sauvegarder
    generator.save_tree()
    
    print("\n✅ Terminé !")

if __name__ == "__main__":
    main()