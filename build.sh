
git pull
rm -Rf right/source/docs

# Copy markdown
mkdir -p right/source/docs
rsync -uvma --include="*/" --include="**.md" docs/* right/source/docs/

for line in `find docs -name '*.md'`; do
	echo $line
	perl ./process.pl $line
done
