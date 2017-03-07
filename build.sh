
# git pull
rm -Rf right/source/docs

# Copy markdown
mkdir -p right/source/docs
rsync -uvma --include="*/" --include="**.md" docs/* right/source/docs/
rsync -uvma --include="*.png" docs/* right/dist/
rsync -uvma --include="*.png" docs/help/* right/dist/

for line in `find docs -name '*.md'`; do
	echo -n "Building: "
	echo $line
	perl ./process.pl $line
done
