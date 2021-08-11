try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup

config = {
    'description': 'Gtbay backend service',
    'author': '6400Spring18Team077',
    'download_url': '',
    'version': '0.1.0',
    'include_package_data': True,
    'packages': ['gtbay'],
    'name': 'gtbay',
}

setup(**config)
