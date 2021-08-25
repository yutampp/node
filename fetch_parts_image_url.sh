cat card/*.txt | grep external | sort | uniq \
| grep "external/image" | sed -e "s/^.*\(external[^\"]*\)[\"|'].*$/\\1/g" | grep -v ")" \
> parts_image_url.out
