var documenterSearchIndex = {"docs":
[{"location":"lib/internals/#Internals-1","page":"Internals","title":"Internals","text":"","category":"section"},{"location":"lib/internals/#","page":"Internals","title":"Internals","text":"Documentation for all non-exported functions can be found below:","category":"page"},{"location":"lib/internals/#Common-1","page":"Internals","title":"Common","text":"","category":"section"},{"location":"lib/internals/#","page":"Internals","title":"Internals","text":"OMETIFF.load\nOMETIFF.dump_omexml","category":"page"},{"location":"lib/internals/#OMETIFF.load","page":"Internals","title":"OMETIFF.load","text":"load(io; dropunused, inmemory) -> ImageMetadata.ImageMeta\n\nLoad an OMETIFF file using the stream io.\n\nArguments\n\ndropunused::Bool: controls whether dimensions of length 1 are dropped automatically (default) or not.\ninmemory::Bool: controls whether arrays are fully loaded into memory (default) or left on disk and specific parts only loaded when accessed.\n\ntip: Tip\nThe inmemory=false flag currently returns a read-only view of the data on the disk for data integrity reasons. In order to modify the contents, you must copy the data into an in-memory container–at least until #52 is fixed–like so:copy(arr)\n\n\n\n\n\n","category":"function"},{"location":"lib/internals/#OMETIFF.dump_omexml","page":"Internals","title":"OMETIFF.dump_omexml","text":"dump_omexml(filepath) -> String\n\nReturns the OME-XML embedded inside the OME-TIFF as a prettified string.\n\n\n\n\n\n","category":"function"},{"location":"lib/internals/#Types-1","page":"Internals","title":"Types","text":"","category":"section"},{"location":"lib/internals/#","page":"Internals","title":"Internals","text":"OMETIFF.IFD\nOMETIFF.TiffFile\nOMETIFF.ReadonlyTiffDiskArray","category":"page"},{"location":"lib/internals/#OMETIFF.IFD","page":"Internals","title":"OMETIFF.IFD","text":"IFD(file, strip_offsets) -> IFD\n\nBuild an Image File Directory (IFD), i.e. a TIFF slice. This structure retains a pointer to its parent file and a list of the offsets within the file corresponding to the data strips.\n\nfile\nPointer to the file containing this IFD\nstrip_offsets\nLocation(s) in file of the data corresponding to this IFD\n\n\n\n\n\n","category":"type"},{"location":"lib/internals/#OMETIFF.TiffFile","page":"Internals","title":"OMETIFF.TiffFile","text":"TiffFile(io) -> TiffFile\n\nWrap io with helper parameters to keep track of file attributes.\n\nuuid\nA unique ID describing this file that is embedded in the XML\nfilepath\nThe relative path to this file\nio\nThe file stream\nfirst_offset\nLocation of the first IFD in the file stream\nneed_bswap\nWhether this file has a different endianness than the host computer\n\n\n\n\n\n","category":"type"},{"location":"lib/internals/#OMETIFF.ReadonlyTiffDiskArray","page":"Internals","title":"OMETIFF.ReadonlyTiffDiskArray","text":"ReadonlyTiffDiskArray(mappedtype, rawtype, ifds, dims) -> ReadonlyTiffDiskArray\n\nA lazy representation of a OMETIFF file. This custom type is needed since TIFF files are laid out noncontiguously and nonregularly. It uses an internal index to determine the mapping from indices to the locations of data slices on disk. These slices are generally XY slices and are usually loaded in all at once so it is quickly loaded into an internal cache to speed up the process. Externally, this type should behave very similarly to an in-memory array, albeit with a higher cost of accessing an element.\n\nifds\nA map of dimensions (sans XY) to the corresponding IFD\n\ndims\nThe full set of dimensions of the TIFF file, including XY\n\ncache\nAn internal cache to fill when reading from disk\n\ncache_index\nThe dimension indices corresponding to the slice currently in the cache\n\n\n\n\n\n","category":"type"},{"location":"lib/internals/#Logic-1","page":"Internals","title":"Logic","text":"","category":"section"},{"location":"lib/internals/#","page":"Internals","title":"Internals","text":"These are the key logic functions that work through the OME and TIFF data and determine the mapping between these two. Future changes to the OME specification should be handle in these functions.","category":"page"},{"location":"lib/internals/#","page":"Internals","title":"Internals","text":"OMETIFF.ifdindex!\nOMETIFF.get_ifds\nOMETIFF.read_ifd\nOMETIFF.build_axes","category":"page"},{"location":"lib/internals/#OMETIFF.ifdindex!","page":"Internals","title":"OMETIFF.ifdindex!","text":"ifdindex!(ifd_index, ifd_files, obs_filepaths, image, dims, tifffile, posidx)\n\n\nOMEXML is very flexible with its representation of the IFDs in the TIFF image. This function attempts to handle many of the exceptions and update the passed collections with the proper mapping of which TiffData elements correspond to which IFDs (and which files these IFDs are located in) inside the TIFF image.\n\nArguments\n\nifd_index::OrderedDict{Int, NTuple{4, Int}}: A mapping from IFD number to dimensions\nifd_files::OrderedDict{Int, Tuple{String, String}}: A mapping from IFD number to the filepath and UUID of the file it's located in\nobs_filepaths::Set{String}: A list of observed filepaths\nimage::EzXML.Node: The OMEXML rooted at the current position\ndims::NamedTuple: Sizes of each dimension with the names as keys\ntifffile::TiffFile: A pointer to the root file\nposidx::Int: The index of the current position\n\nThe first two parameters should be then pumped through OMETIFF.get_ifds\n\n\n\n\n\n","category":"function"},{"location":"lib/internals/#OMETIFF.get_ifds","page":"Internals","title":"OMETIFF.get_ifds","text":"get_ifds(orig_file, ifd_index, ifd_files) -> Dict, Dict\n\nRun through all the IFDs extracted from the OMEXML and open all the referenced files to construct a mapping of ZCTP (not guaranteed order) index to IFD object. This is necessary because there can be multiple files referenced in a single OMEXML and we need to iterate over the files to identify the actual offsets for the data since this information isn't found in the OMEXML.\n\nOutput\n\nDict{Tuple{String, String}, TiffFile}: a mapping of filepath, UUID to the  actual TiffFile object\nOrderedDict{NTuple{4, Int}, IFD}: a mapping of ZCTP (or other order) index  to the IFD objects in order that the IFDs are referenced in the OMEXML\n\n\n\n\n\n","category":"function"},{"location":"lib/internals/#OMETIFF.read_ifd","page":"Internals","title":"OMETIFF.read_ifd","text":"read_ifd(file, offset; getxml)\n\nRead the tags of the IFD located at offset in TiffFile file.\n\n\n\n\n\n","category":"function"},{"location":"lib/internals/#OMETIFF.build_axes","page":"Internals","title":"OMETIFF.build_axes","text":"build_axes(image) -> Tuple, Vector\n\nExtracts the dimensions and axis information from the OMEXML data.\n\nOutput\n\nNamedTuple{order, NTuple{6, Int}}: the labeled 6 dimensions in the order that they are specified in the OMEXML.\nVector{AxisArray.Axis}: List of AxisArray.Axis objects with units (if possible) in the same order as above\n\nwarning: Warning\nThere's no guarantee that the dimension sizes extracted here are correct if the acquisition was cancelled during a multiposition session. See #38. Downstream functions should be flexible and handle these cases.\n\n\n\n\n\n","category":"function"},{"location":"lib/internals/#Construction-1","page":"Internals","title":"Construction","text":"","category":"section"},{"location":"lib/internals/#","page":"Internals","title":"Internals","text":"OMETIFF.inmemoryarray","category":"page"},{"location":"lib/internals/#OMETIFF.inmemoryarray","page":"Internals","title":"OMETIFF.inmemoryarray","text":"inmemoryarray(ifds, dims, rawtype, mappedtype) -> Array\n\nBuilds an in-memory high-dimensional image using the mapping provided by ifds from indices to OMETIFF.IFD objects. The IFD objects store handles to the file objects and the offsets for the data. dims stores the size of each named dimension. The rawtype parameter describes the storage layout of each element on disk and mappedtype is the corresponding fixed or floating point type.\n\n\n\n\n\n","category":"function"},{"location":"lib/internals/#Miscellaneous-1","page":"Internals","title":"Miscellaneous","text":"","category":"section"},{"location":"lib/internals/#","page":"Internals","title":"Internals","text":"Base.iterate\nOMETIFF.check_bswap\nOMETIFF.do_bswap\nOMETIFF.extract_filename\nOMETIFF.get_elapsed_times\nOMETIFF.get_unitful_axis\nOMETIFF.load_comments\nOMETIFF.load_master_xml\nOMETIFF.myendian\nOMETIFF.to_symbol\nOMETIFF.usingUUID","category":"page"},{"location":"lib/internals/#Base.iterate","page":"Internals","title":"Base.iterate","text":"iterate(iter [, state]) -> Union{Nothing, Tuple{Any, Any}}\n\nAdvance the iterator to obtain the next element. If no elements remain, nothing should be returned. Otherwise, a 2-tuple of the next element and the new iteration state should be returned.\n\n\n\n\n\n","category":"function"},{"location":"lib/internals/#OMETIFF.check_bswap","page":"Internals","title":"OMETIFF.check_bswap","text":"check_bswap(io::Union{Stream, IOStream})\n\nCheck endianness of TIFF file to see if we need to swap bytes\n\n\n\n\n\n","category":"function"},{"location":"lib/internals/#OMETIFF.do_bswap","page":"Internals","title":"OMETIFF.do_bswap","text":"do_bswap(file, values) -> Array\n\nIf the endianness of file is different than that of the current machine, swap the byte order.\n\n\n\n\n\n","category":"function"},{"location":"lib/internals/#OMETIFF.extract_filename","page":"Internals","title":"OMETIFF.extract_filename","text":"extract_filename(io) -> String\n\nExtract the name of the file backing a stream\n\n\n\n\n\n","category":"function"},{"location":"lib/internals/#OMETIFF.get_elapsed_times","page":"Internals","title":"OMETIFF.get_elapsed_times","text":"get_elapsed_times(containers, master_dims, masteraxis; default_unit)\n\n\n-> AxisArray\n\nExtracts the actual acquisition times from the OME-XML data. Takes containers, a vector of the XML nodes corresponding to the root of each image.\n\n\n\n\n\n","category":"function"},{"location":"lib/internals/#OMETIFF.get_unitful_axis","page":"Internals","title":"OMETIFF.get_unitful_axis","text":"get_unitful_axis(image, dimsize, stepsize, units) -> Range\n\nAttempts to return a unitful range with a length of dimsize. Parameters stepsize and units should be the XML tags in image.\n\n\n\n\n\n","category":"function"},{"location":"lib/internals/#OMETIFF.load_comments","page":"Internals","title":"OMETIFF.load_comments","text":"load_comments(file) -> String\n\nExtracts the MicroManager embedded description, if present. Else returns an empty string.\n\n\n\n\n\n","category":"function"},{"location":"lib/internals/#OMETIFF.load_master_xml","page":"Internals","title":"OMETIFF.load_master_xml","text":"load_master_xml(file::TiffFile) -> EzXML.doc\n\nLoads the master OME-XML file from file or from a linked file.\n\n\n\n\n\n","category":"function"},{"location":"lib/internals/#OMETIFF.myendian","page":"Internals","title":"OMETIFF.myendian","text":"myendian() -> UInt16\n\nReturns the endianness of the host machine\n\n\n\n\n\n","category":"function"},{"location":"lib/internals/#OMETIFF.to_symbol","page":"Internals","title":"OMETIFF.to_symbol","text":"to_symbol(input) -> String\n\nCleans up input string and converts it into a symbol, needed so that channel names work with AxisArrays.\n\n\n\n\n\n","category":"function"},{"location":"lib/internals/#OMETIFF.usingUUID","page":"Internals","title":"OMETIFF.usingUUID","text":"usingUUID(tf) -> Bool\n\nWhether there was a UUID embedded in this file. According to the schema UUIDs have the following pattern: (urn:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\n\n\n\n\n\n","category":"function"},{"location":"#I/O-operations-for-OME-TIFF-files-in-Julia-with-a-focus-on-correctness-1","page":"Home","title":"I/O operations for OME-TIFF files in Julia with a focus on correctness","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Adds support for reading OME-TIFF files to the Images.jl platform. Allows fast and easy interfacing with high-dimensional data with nice labeled axes provided by AxisArrays.jl.","category":"page"},{"location":"#Features-1","page":"Home","title":"Features","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Can open a wide-range of OMETIFF files with a special focus on correctness\nSupports memory-mapping to open large TIFF files quickly even on memory-constrained machines\nSpatial and temporal axes are annotated with units if available (like μm, s, etc)\nChannel and position axes use their original names\nElapsed times are extracted and returned using the same labeled axes\nImportant metadata is extracted and included in an easy to access format","category":"page"},{"location":"#Installation-1","page":"Home","title":"Installation","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"OMETIFF.jl will be automatically installed when you use FileIO to open an OME-TIFF file. You can also install it by running the following in the Julia REPL:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"] add OMETIFF","category":"page"}]
}
