# Makefile for compiling frontend javascript and content, css, etc.
.PHONY: all output_dir lessonplanjs neurosims interactives images css js lesson_plans slides openid static_links svgwebfonts

SRC_ROOT=frontend
CONTENT_ROOT=content
OUTPUT=static

all: js


output_dir:
	mkdir -p ${OUTPUT}

neurosims: output_dir
	@echo Compiling neurosims.js
	mkdir -p ${OUTPUT}/neurosims
	cd ${SRC_ROOT}/neurosims; make
	cp -r ${SRC_ROOT}/neurosims/js/* ${OUTPUT}/neurosims/

css: output_dir
	@echo Compiling CSS
	mkdir -p ${OUTPUT}/css
	cp -r ${SRC_ROOT}/css/*.css ${OUTPUT}/css/
	cp -r ${SRC_ROOT}/css/*.png ${OUTPUT}/css/
	cp -r ${SRC_ROOT}/css/*.gif ${OUTPUT}/css/
	# cp -r ${SRC_ROOT}/css/*.jpg ${OUTPUT}/css/
	find ${SRC_ROOT}/css/ -name '*.less' -exec lessc -x {} \; > ${OUTPUT}/css/mcb80x.css

images:
	@echo Copying images into static output directory
	mkdir -p ${OUTPUT}/images
	cp -r ${SRC_ROOT}/images/* ${OUTPUT}/images/

lesson_plans:
	@echo Compiling lesson plans
	mkdir -p ${OUTPUT}/lesson_plans
	coffee -co ${OUTPUT}/lesson_plans ${CONTENT_ROOT}/lesson_plans

watch_lesson_plans:
	coffee -cwo ${OUTPUT}/lesson_plans ${CONTENT_ROOT}/lesson_plans

js: output_dir
	@echo Compiling js
	mkdir -p ${OUTPUT}/js
	coffee -co ${OUTPUT}/js ${SRC_ROOT}/js


interactives:
	@echo Compiling interactives
	mkdir -p ${OUTPUT}/interactives
	cp -r ${SRC_ROOT}/interactives/* ${OUTPUT}/interactives/
	coffee -co ${OUTPUT}/interactives ${SRC_ROOT}/interactives

watch_interactives:
	coffee -cwo ${OUTPUT}/interactives ${SRC_ROOT}/interactives &

openid:
	@echo Copying openid stuff
	mkdir -p ${OUTPUT}/openid
	cp -r ${SRC_ROOT}/openid/* ${OUTPUT}/openid/


lessonplanjs: output_dir
	@echo Compiling lessonplan.js and copying
	touch ${OUTPUT}/lessonplan
	rm -rf ${OUTPUT}/lessonplan
	cd ${SRC_ROOT}/lessonplanjs; make
	cp -r ${SRC_ROOT}/lessonplanjs/js ${OUTPUT}/lessonplan

slides:
	@echo Copying slides
	touch ${OUTPUT}/slides
	rm -rf ${OUTPUT}/slides
	cd ${OUTPUT}; cp -r ../${CONTENT_ROOT}/slides slides

copy_static:
	@echo Linking static resource directories
	touch ${OUTPUT}/info_site
	rm -rf ${OUTPUT}/info_site
	cd ${OUTPUT}; cp -r ../info_site info_site
	# touch ${OUTPUT}/audio
	# rm -rf ${OUTPUT}/audio
	#cd ${OUTPUT}; ln -s ../audio audio
	touch ${OUTPUT}/images3d
	rm -rf ${OUTPUT}/images3d
	cd ${OUTPUT}; ln -s ../images3d images3d
	touch ${OUTPUT}/press
	rm -rf ${OUTPUT}/press
	cd ${OUTPUT}; cp -r ../press press

svgwebfonts:
	@echo Fixing svg webfonts
	./fix_svg_webfonts.sh


link_lessonplanjs: output_dir
	@echo Compiling lessonplan.js and linking...
	touch ${OUTPUT}/lessonplan
	rm -rf ${OUTPUT}/lessonplan
	cd ${SRC_ROOT}/lessonplanjs; make watch
	cd ${OUTPUT}; ln -s ../${SRC_ROOT}/lessonplanjs/js lessonplan


link_slides:
	@echo Linking slides
	touch ${OUTPUT}/slides
	rm -rf ${OUTPUT}/slides
	cd ${OUTPUT}; ln -s ../${CONTENT_ROOT}/slides slides

link_static:
	@echo Linking static resource directories
	touch ${OUTPUT}/info_site
	rm -rf ${OUTPUT}/info_site
	# touch ${OUTPUT}/audio
	# rm -rf ${OUTPUT}/audio
	cd ${OUTPUT}; ln -s ../info_site info_site
	# cd ${OUTPUT}; ln -s ../audio audio

serve:
	@echo Live-compiling lesson plans... edits in the content/lesson_plans directory will be automatically compiled and installed
	mkdir -p ${OUTPUT}/lesson_plans
	coffee -cwo ${OUTPUT}/lesson_plans ${CONTENT_ROOT}/lesson_plans &
	python app.py
